import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/user/login",
        {
          email,
          password,
        }
      );

      if (res.data.success) {
        toast.success("Login successful!");
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed! Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f3f1]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 mb-6">Login to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email address"
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
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm text-gray-500">
          <Link
            to="/user/forgot-password"
            className="text-teal-600 font-medium"
          >
            Forgot Password?
          </Link>

          <span>
            Don’t have an account?{" "}
            <Link to="/user/register" className="text-teal-600 font-medium">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;