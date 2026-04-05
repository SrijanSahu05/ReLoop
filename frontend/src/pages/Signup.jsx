import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/user/register",
        {
          firstName,
          lastName,
          email,
          password,
        }
      );

      if (res.data.success) {
        toast.success("Registration successful! Please verify your email.");
        navigate("/user/verify-email", { state: { email } });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f3f1]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-500 mb-6">
          Enter given details below to create your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="flex gap-3">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First Name"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last Name"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter Your Email"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Your Password"
              className="w-full border rounded-xl p-3 pr-10 outline-none focus:ring-2 focus:ring-teal-500"
            />

            {showPassword ? (
              <EyeOff
                className="absolute right-4 top-[42px] cursor-pointer text-gray-500"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                className="absolute right-4 top-[42px] cursor-pointer text-gray-500"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Your Password"
              className="w-full border rounded-xl p-3 pr-10 outline-none focus:ring-2 focus:ring-teal-500"
            />

            {showConfirmPassword ? (
              <EyeOff
                className="absolute right-4 top-[42px] cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <Eye
                className="absolute right-4 top-[42px] cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/user/login" className="text-teal-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;