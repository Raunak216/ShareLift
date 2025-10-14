import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import GoogleLogin from "./GoogleLogin";
import React from "react";

function NavBar() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Guard clause for loading state
  if (isLoading) {
    return null; // Or a simple loading bar/spinner
  }

  return (
    <>
      <nav className="w-full relative z-30 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link to={"/"}>
                {/* Responsive logo height: h-16 on mobile, h-20 on desktop */}
                <img
                  className="h-16 md:h-20 ml-0 md:ml-4"
                  src="/Logo1.png"
                  alt="VIT TravelMate Finder Logo"
                />
              </Link>
            </div>

            {/* Links and Actions Section */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* My Requests Link (Logged In) */}
              {user && isLoggedIn && (
                <Link
                  to={"/api/groups/my"}
                  className="p-1 md:p-2 m-1 md:m-3 transition duration-150 hover:bg-gray-700 rounded"
                >
                  <p className="text-yellow-400 text-lg md:text-2xl font-bold noto-serif-typeWritter whitespace-nowrap">
                    My Requests
                  </p>
                </Link>
              )}

              {/* Login Button (Logged Out) */}
              {!user && !isLoggedIn && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="p-1 md:p-2 m-1 md:m-3 "
                >
                  <p className="text-yellow-500 text-lg md:text-2xl font-bold noto-serif-typeWritter whitespace-nowrap px-2">
                    Login
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
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
