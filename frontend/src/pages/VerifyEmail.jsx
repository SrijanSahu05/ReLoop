import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import BASE_URL from "../config/api";

const VerifyEmail = () => {
  const location = useLocation(); // Access the passed state
  const navigate = useNavigate();

  const email = location.state?.email || ""; // Get email from state or default to empty string

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds

  // Timer starts when page loads
  useEffect(() => {
    if (!email) {
      toast.error("No email provided for verification.");
      navigate("/user/register");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("OTP expired. Please request a new one.");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  // Format time in MM:SS format
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/user/verify-email`, {
        email,
        otp,
      });

      if (res.data.success) {
        toast.success("Email verified successfully! You can now log in.");
        navigate("/user/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(`${BASE_URL}/user/resend-otp`, { email });
      toast.success("OTP resent successfully! Please check your email.");
      setTimeLeft(600); // Reset timer to 10 minutes
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again."); 
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f3f1]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Verify Your Email 📩
        </h2>

        <p className="text-gray-500 mb-6">
          Enter the OTP sent to your email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (Disabled Field) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border rounded-xl p-3 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6 digit OTP"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* TIMER */}
          <p className="text-sm text-gray-500">
            OTP expires in:{" "}
            <span className="font-semibold text-teal-600">{formatTime()}</span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 transition"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend OTP */}
        <button
          onClick={handleResendOTP}
          disabled={timeLeft !== 0}
          className={`w-full mt-4 rounded-xl py-2 transition ${
            timeLeft === 0
              ? "bg-gray-800 text-white hover:bg-gray-900"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;