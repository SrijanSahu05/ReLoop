import axios from "axios";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  User,
  PlusSquare,
  Package,
  MessageSquare,
  Bookmark,
  LogOut,
  X,
} from "lucide-react";

const DashboardSidebar = ({
  updateUser,
  mobileMenu,
  setMobileMenu,
  active,
  setActive,
}) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Added icons to the menu array
  const menu = [
    { id: "details", label: "My Profile", icon: User },
    { id: "publish", label: "Publish Item", icon: PlusSquare },
    { id: "items", label: "My Items", icon: Package },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "savedItems", label: "Saved Items", icon: Bookmark },
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (res.data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed! Try again.",
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenu, setMobileMenu]);

  return (
    <>
      {/* Optional Dark Overlay for Mobile */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" />
      )}

      <div
        ref={sidebarRef}
        className={`bg-white shadow-md z-40 mt-0 ml-0 md:mt-5 md:ml-3 rounded-none md:rounded-2xl
          fixed md:relative w-72 md:w-64 h-full md:h-[calc(100vh-40px)] transition-all duration-300 ease-in-out border border-gray-200 flex flex-col
          ${mobileMenu ? "left-0" : "-left-80 md:left-0"}`}
      >
        {/* MOBILE CLOSE BUTTON */}
        <button
          onClick={() => setMobileMenu(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* USER INFO */}
        <div className="flex flex-col items-center py-8 border-b border-gray-100 px-4">
          <div className="relative">
            {updateUser?.profilePic ? (
              <img
                src={updateUser.profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-50 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-teal-50 ring-4 ring-teal-100/50 flex items-center justify-center text-teal-600 text-4xl font-bold shadow-sm">
                {updateUser?.firstName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h2 className="mt-4 font-bold text-gray-800 text-lg tracking-tight text-center">
            {updateUser?.firstName} {updateUser?.lastName}
          </h2>
          <p className="text-sm text-gray-500 w-full text-center truncate px-2">
            {updateUser?.email}
          </p>
        </div>

        {/* MENU */}
        <div className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
          {menu.map((m) => {
            const Icon = m.icon;
            const isActive = active === m.id;

            return (
              <button
                key={m.id}
                onClick={() => {
                  setActive(m.id);
                  setMobileMenu(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98]
                  ${
                    isActive
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20 font-semibold"
                      : "text-gray-600 hover:bg-teal-50 hover:text-teal-700 font-medium"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`}
                />
                {m.label}
              </button>
            );
          })}

          {/* LOGOUT BUTTON */}
          <div className="mt-auto pt-4 pb-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
