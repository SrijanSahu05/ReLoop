import React from "react";
import { Camera, Lock, User, MapPin, Phone } from "lucide-react";

const ProfileForm = ({
  updateUser,
  handleSubmit,
  handleChange,
  handleImageChange,
  loading,
}) => {
  return (
    <div className="bg-white mx-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-10 max-w-4xl">
      <form onSubmit={handleSubmit}>
        
        {/* HEADER */}
        <div className="mb-10 pb-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Profile Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal information and profile picture.
          </p>
        </div>

        {/* CONTENT LAYOUT */}
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* ================= PROFILE IMAGE COLUMN ================= */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative group">
              {/* Avatar */}
              <div className="w-36 h-36 rounded-full p-1 border-2 border-dashed border-teal-200">
                {updateUser?.profilePic ? (
                  <img
                    src={updateUser.profilePic}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-5xl font-bold">
                    {updateUser?.firstName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Upload Button Overlay */}
              <label className="absolute bottom-1 right-1 bg-teal-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-teal-700 hover:scale-110 transition-all duration-200 border-4 border-white">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Allowed: JPG, PNG, GIF. <br /> Max size of 5MB.
            </p>
          </div>

          {/* ================= PROFILE FORM COLUMN ================= */}
          <div className="flex-1 grid gap-6">
            
            {/* NAME SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" /> First Name
                </label>
                <input
                  name="firstName"
                  placeholder="John"
                  value={updateUser.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                <input
                  name="lastName"
                  placeholder="Doe"
                  value={updateUser.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            {/* CONTACT SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Phone Number
                </label>
                <input
                  name="phoneNo"
                  placeholder="+1 (555) 000-0000"
                  value={updateUser.phoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <input
                    name="email"
                    disabled
                    value={updateUser.email}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-2" />

            {/* LOCATION SECTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Street Address
              </label>
              <input
                name="address"
                placeholder="123 Main St, Apt 4B"
                value={updateUser.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all text-gray-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input
                  name="city"
                  placeholder="New York"
                  value={updateUser.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
                <input
                  name="state"
                  placeholder="NY"
                  value={updateUser.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pin Code</label>
                <input
                  name="pinCode"
                  placeholder="10001"
                  value={updateUser.pinCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all text-gray-800"
                />
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-10 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2.5 rounded-xl font-semibold transition-all duration-200 ease-in-out
              ${loading 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-sm hover:shadow-md"
              }`}
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;