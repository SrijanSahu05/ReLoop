import React from "react";
import { useNavigate } from "react-router-dom";

const ShowAuthPopUp = ({ setShowAuthPopup }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-scaleIn">
        <h2 className="text-xl font-semibold text-gray-800">
          Login Required 🔐
        </h2>

        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Please login to access this feature. Don't have an account? Sign up
          now to unlock all features.
        </p>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => navigate("/user/login")}
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/user/register")}
            className="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Sign Up
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={() => setShowAuthPopup(false)}
          className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-white text-2xl font-bold hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ShowAuthPopUp;