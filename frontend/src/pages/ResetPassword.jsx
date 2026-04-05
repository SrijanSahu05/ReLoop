import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import BASE_URL from "../config/api";

const ResetPassword = () => {
  const location = useLocation(); // Access the passed state
  const navigate = useNavigate();

  const email = location.state?.email || ""; // Get email from state or default to empty string

  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Email is required to reset password, if not present redirect to login
  useEffect(() => {
    if (!email) {
      toast.error("No email provided for verification.");
      navigate("/user/login");
      return;
    }
  }, [email, navigate]);


  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/user/reset-password`, {
        email,
        newPassword,
        confirmPassword
      });

      if (res.data.success) {
        toast.success("Password reset successful! You can now log in with your new password.");
        navigate("/user/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f3f1]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Reset Your Password 🔒
        </h2>

        <p className="text-gray-500 mb-6">
            Enter your new password below. Make sure it's strong and secure!
        </p>

        <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              placeholder="Enter your new password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;