import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import {
  sendForgotPasswordOTP,
  sendOTPMail,
} from "../emailVerify/SendOTPMail.js";
import cloudinary from "../utils/Cloudinary.js";
import { Product } from "../models/productModel.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    newUser.otp = otp;
    newUser.otpExpiry = otpExpiry;

    await newUser.save();

    await sendOTPMail(otp, email);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in userSignup controller ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated, please request a new one",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired, please request a new one",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully, you can now login",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPMail(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User not exists, please create an account.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExist.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    if (isUserExist.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Verify your account than login",
      });
    }

    //generate token
    const accessToken = jwt.sign(
      { id: isUserExist._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshToken = jwt.sign(
      { id: isUserExist._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    isUserExist.isLoggedIn = true;
    await isUserExist.save();

    //Check for existing session
    const existingSession = await Session.findOne({ userId: isUserExist._id });
    if (existingSession) {
      await Session.deleteOne({ userId: isUserExist._id });
    }

    //Create new session
    await Session.create({ userId: isUserExist._id });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${isUserExist.firstName}`,
      user: isUserExist,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const UserLogout = async (req, res) => {
  try {
    const userId = req.id;

    await Session.deleteMany({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendForgotPasswordOTP(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email, please check and reset your password",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message:
          "OTP not generated or already verified, please request a new one",
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired, please request a new one",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully, you can now reset your password",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully, you can now login with your new password",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id; //the ID of the user we want to update
    const loggedInUser = req.user; //from isAuthenticated middleware
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      pinCode,
      phoneNo,
      role,
    } = req.body;

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this user",
      });
    }

    let user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // If a new file is uploaded, update the profile picture
    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Store4U_profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    // Update user fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.pinCode = pinCode || user.pinCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const saveProduct = async (req, res) => {
  try {
    const userId = req.id;
    const productId = req.params.productId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedProducts: productId },
    });

    return res.status(200).json({
      success: true,
      message: "Product saved successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const isProductSaved = async (req, res) => {
  try {
    const user = await User.findById(req.id);

    const isSaved = user.savedProducts.some(
      (id) => id.toString() == req.params.productId
    );

    return res.json({ success: true, isSaved });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

export const unsaveProduct = async (req, res) => {
  try {
    const userId = req.id;
    const productId = req.params.productId;

    await User.findByIdAndUpdate(userId, {
      $pull: { savedProducts: productId },
    });

    return res.status(200).json({
      success: true,
      message: "Product Removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};

export const getSavedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate("savedProducts");

    return res.status(200).json({
      success: true,
      savedProducts: user.savedProducts
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};