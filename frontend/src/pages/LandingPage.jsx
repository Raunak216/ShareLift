import React from "react"; // Removed unused imports
import NavBar from "../components/Navbar";
import RideRequestForm from "../components/RideReqForm";
import { useAuth } from "../Contexts/AuthContext";
import { motion } from "framer-motion";
import CabServicesCarousal from "../components/CabServicesCarousal";
import Typewriter from "../components/TypeWritter";
import { FooterComponent } from "../components/FooterComponent";

function LandingPage() {
  const { user, isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Consider a more styled loader here
  }
  const handleScroll = () => {
    window.scrollBy({
      top: 1.03 * window.innerHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="wrapper">
        <div className="gradient gradient-1"></div>
        <div className="gradient gradient-2"></div>
        <div className="gradient gradient-3"></div>
      </div>
      <NavBar />

      <main className="mx-auto px-4 py-2 md:px-9">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center min-h-[80vh] md:min-h-[90vh]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:flex-1 flex flex-col justify-center text-center md:text-left mb-6 lg:mb-0"
          >
            <div className="w-full max-w-2xl mx-auto md:mx-0">
              {/* Typewriter  */}
              <div className="mb-2 md:mb-8 h-[5rem] md:h-auto">
                <Typewriter />
              </div>

              <div className="space-y-4 mt-10 md:mt-0 md:space-y-6">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-300 leading-relaxed md:leading-relaxed ">
                  Connect with verified VITians traveling the same route.
                  <br className="  hidden md:block" /> Save money, share rides,
                  and make your journey stress-free.
                </p>
                <p className="text-base sm:text-lg md:text-2xl lg:text-xl font-medium text-gray-100 leading-relaxed">
                  Start now - find your travel group in seconds.
                </p>

                {/* CTA Button */}
                <motion.div
                  className="lg:hidden   flex justify-center md:justify-start pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <button
                    onClick={handleScroll}
                    className="bg-[rgba(249,247,247,0.1)] mt-8  text-gray-400 font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 transform "
                  >
                    Search TravelMates Now
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Form hidden on mobile */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-96 xl:w-[500px]   rounded-xl relative z-1 hidden lg:block"
          >
            <RideRequestForm />
          </motion.div>
        </div>

        {/* Form Section */}
        <div className="lg:hidden  w-full rounded-xl relative z-1 my-8">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            <RideRequestForm />
          </motion.div>
        </div>
      </main>

      <CabServicesCarousal />
      <FooterComponent />
    </div>
  );
}

export default LandingPage;
