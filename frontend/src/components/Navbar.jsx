import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <div className="flex gap-6">
        <Link to="/" className="text-2xl font-semibold text-gray-100 hover:text-gray-300">
          Bhutta Store
        </Link>
        {user && (
          <>
            <Link
              to="/"
              className="text-lg font-medium text-gray-200 hover:text-gray-300"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="text-lg font-medium text-gray-200 hover:text-gray-300"
            >
              Cart
            </Link>
          </>
        )}
      </div>

      <div className="flex gap-4">
        {user ? (
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-lg font-medium text-gray-200 hover:text-gray-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-lg font-medium text-gray-200 hover:text-gray-300"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
