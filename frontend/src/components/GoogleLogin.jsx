import { useState } from "react";
import Modal from "./modal";
import getGoogleUrl from "../utils/getGoogleUrl";
import axios from "../axiosConfig.js";
function GoogleLogin({ open, onclose }) {
  const googleLogin = async () => {
    const serverEndpoint =
      process.env.REACT_APP_SERVER_ENDPOINT ||
      "https://sharelift-backend1-557676259557.asia-south1.run.app";
    window.location.href = `${serverEndpoint}/api/auth/google`;
  };
  return (
    <>
      <Modal open={open} onclose={onclose}>
        <div className="md:p-6 text-center">
          {/* Headline */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Please Verify Your Identity to Continue
          </h2>

          {/* Explanation */}
          <p className="text-sm text-gray-600 mb-6">
            We require verification using your
            <strong className="text-indigo-800"> @vitstudent.ac.in</strong>
            email. This keeps our community trusted and ensures only fellow
            students are matched!
          </p>

          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center px-4 py-3 border rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5 mr-3 bg-white p-0.5 rounded"
            />
            Sign In with VIT Email
          </button>

          <p className="mt-4 text-xs text-gray-500">Takes just a second!</p>
        </div>
      </Modal>
    </>
  );
}
export default GoogleLogin;
