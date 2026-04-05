import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Repeat } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* ===== BRAND SECTION ===== */}
        <div className="md:col-span-1">
          <Link
            to="/"
            className="group flex items-center gap-1.5 text-2xl font-bold tracking-tight inline-flex"
          >
            <div className="bg-teal-500 text-white p-1 rounded-xl shadow-sm group-hover:rotate-180 transition-transform duration-500 ease-in-out">
              <Repeat className="w-5 h-5 stroke-[2.5]" />
            </div>
            {/* Switched text to white, and teal to 400 for dark mode contrast */}
            <span className="text-white">
              Re<span className="text-teal-400">loop</span>
            </span>
          </Link>
          <p className="text-gray-400 mt-4 text-sm leading-relaxed">
            Your trusted marketplace to give unused items a second life. Buy,
            sell, and connect with your community easily and sustainably.
          </p>
        </div>

        {/* ===== QUICK LINKS ===== */}
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-teal-400 hover:translate-x-1 inline-block transition-all duration-200 font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-gray-400 hover:text-teal-400 hover:translate-x-1 inline-block transition-all duration-200 font-medium"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-gray-400 hover:text-teal-400 hover:translate-x-1 inline-block transition-all duration-200 font-medium"
              >
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* ===== SUPPORT ===== */}
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wide">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="text-gray-400 hover:text-teal-400 hover:translate-x-1 inline-block transition-all duration-200 font-medium cursor-pointer">
                Help Center
              </span>
            </li>
            <li>
              <span className="text-gray-400 hover:text-teal-400 hover:translate-x-1 inline-block transition-all duration-200 font-medium cursor-pointer">
                Privacy Policy
              </span>
            </li>
            <li>
              <span className="text-gray-400 hover:text-teal-400 hover:translate-x-1 inline-block transition-all duration-200 font-medium cursor-pointer">
                Terms & Conditions
              </span>
            </li>
          </ul>
        </div>

        {/* ===== SOCIAL LINKS ===== */}
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wide">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-teal-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <Facebook size={18} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-teal-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <Instagram size={18} />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-teal-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-400 font-medium bg-gray-950">
        © {new Date().getFullYear()} Reloop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;