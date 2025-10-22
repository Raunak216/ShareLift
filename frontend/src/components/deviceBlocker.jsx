import React from "react";
const DeviceBlocker = () => {
  return (
    <div
      className="
        fixed inset-0 z-[1000] 
        bg-gray-900/95 
        text-white 
        flex flex-col items-center justify-center 
        p-8 
        hidden xs:flex lg:hidden 
      "
    >
      <div className="text-center p-6 bg-cyan-700/20 border border-cyan-400 rounded-xl shadow-2xl max-w-sm">
        <h2 className="text-3xl font-extrabold text-cyan-300 mb-4">
          Device Not Supported temporarily
        </h2>
        <p className="text-lg mb-4">
          For the best experience and layout integrity, please use standard
          mobile device or desktop browser .
        </p>
        <p className="text-lg font-medium">
          (Screen widths between 480px and 1024px are temporarily restricted.)
        </p>
      </div>
    </div>
  );
};

export default DeviceBlocker;
