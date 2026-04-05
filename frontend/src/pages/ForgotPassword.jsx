import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BASE_URL from "../config/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min = 600 sec

  // ================= TIMER LOGIC =================
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    try {
      setSendingOtp(true);

      await axios.post(
        `${BASE_URL}/user/forgot-password`,
        { email }
      );

      toast.success("OTP sent to your email");

      setTimerActive(true);
      setTimeLeft(600);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setSendingOtp(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      setVerifyingOtp(true);

      const res = await axios.post(
        `${BASE_URL}/user/verify-reset-password-otp`,
        { email, otp }
      );

      if (res.data.success) {
        toast.success("OTP verified successfully");
        navigate("/user/reset-password", { state: { email } });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f3f1]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-500 mb-6">
          Enter your registered email to receive an OTP and reset your password.
        </p>

        <div className="space-y-5">

          {/* EMAIL + SEND OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>

            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                disabled={timerActive}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className={`flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500 ${
                  timerActive ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || timerActive}
                className={`px-4 whitespace-nowrap bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition ${
                  sendingOtp || timerActive ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP + VERIFY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6 digit OTP"
                className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-500"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyingOtp}
                className="px-4 whitespace-nowrap bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition"
              >
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>

          {/* TIMER */}
          {timerActive && (
            <p className="text-sm text-gray-500">
              OTP expires in:{" "}
              <span className="font-semibold text-teal-600">
                {formatTime()}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;