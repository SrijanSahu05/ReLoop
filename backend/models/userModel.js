import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePic: { type: String, default: "" }, // Cloudinary img URL
    profilePicPublicId: { type: String, default: "" }, // Cloudinary public id for deletion
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isLoggedIn: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: String },
    city: { type: String },
    state: {type: String },
    pinCode: { type: String },
    phoneNo: { type: String },
    savedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]
}, { timestamps: true });

const User = mongoose.model("User", userModel);

export default User;