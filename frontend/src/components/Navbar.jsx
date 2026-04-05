import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import axios from "axios";
import { Menu, Repeat, X, LogOut, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("accessToken");

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) handleLogout();
    } catch {
      handleLogout();
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed! Try again."
      );
    }
  };

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-1.5 text-2xl sm:text-3xl font-bold tracking-tight"
        >
          <div className="bg-teal-600 text-white p-1 rounded-xl shadow-sm group-hover:rotate-180 transition-transform duration-500 ease-in-out">
            <Repeat className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <span className="text-gray-800">
            Re<span className="text-teal-600">loop</span>
          </span>
        </Link>

        {/* HAMBURGER (MOBILE) */}
        <button
          className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <Menu
              className={`absolute inset-0 transition-all duration-300 ${
                menuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <X
              className={`absolute inset-0 transition-all duration-300 ${
                menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
              }`}
            />
          </div>
        </button>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 mr-4">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Products
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              
              {/* USER INFO & AVATAR */}
              <div
                onClick={() => navigate(`/user/profile/${user._id}`)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors hidden lg:block">
                  Hi, {user.firstName}
                </span>

                <div className="relative">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-teal-500 transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold border-2 border-transparent group-hover:border-teal-500 transition-all shadow-sm">
                      {user.firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Status dot */}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <Link
                to="/user/login"
                className="text-sm font-semibold text-gray-600 hover:text-teal-600 px-4 py-2 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/user/register"
                className="bg-teal-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-teal-700 hover:shadow-md transition-all active:scale-95"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div 
        className={`md:hidden absolute top-[64px] left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-hidden origin-top transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-4 py-6 gap-2">
          <Link to="/" className="px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-teal-50 hover:text-teal-700 transition">
            Home
          </Link>
          <Link to="/products" className="px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-teal-50 hover:text-teal-700 transition">
            Products
          </Link>

          <div className="h-px bg-gray-100 my-2 mx-4"></div>

          {user ? (
            <>
              <Link
                to={`/user/profile/${user._id}`}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                <UserIcon className="w-5 h-5 text-gray-400" />
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition w-full text-left"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 px-2 mt-2">
              <Link
                to="/user/login"
                className="w-full text-center px-4 py-3 text-teal-700 font-semibold bg-teal-50 rounded-xl hover:bg-teal-100 transition"
              >
                Log in
              </Link>
              <Link
                to="/user/register"
                className="w-full text-center px-4 py-3 text-white font-semibold bg-teal-600 rounded-xl hover:bg-teal-700 transition shadow-sm"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;