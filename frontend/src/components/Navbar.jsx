import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import GoogleLogin from "./GoogleLogin";
import React from "react";

function NavBar() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <nav className="w-screen relative z-30">
        <div className=" lg:mx-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Left Side */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={"/"}>
                <img
                  className="h-16 md:h-20" // Consistent height
                  src="/Logo1.png"
                  alt="VIT TravelMate Finder Logo"
                />
              </Link>
            </div>

            {/* Navigation Items - Right Side */}
            <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
              {user && isLoggedIn && (
                <Link
                  to={"/api/groups/my"}
                  className="px-4 py-2 transition duration-150 hover:bg-gray-700 rounded-lg"
                >
                  <p className="text-yellow-400 text-lg md:text-2xl font-bold noto-serif-typeWritter whitespace-nowrap">
                    My Requests
                  </p>
                </Link>
              )}

              {!user && !isLoggedIn && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 transition duration-150 hover:bg-gray-700 rounded-lg"
                >
                  <p className="text-yellow-500 text-lg md:text-3xl font-bold noto-serif-typeWritter whitespace-nowrap">
                    Login
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLoginModal && (
        <GoogleLogin
          open={showLoginModal}
          onclose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}

export default NavBar;
