import React from "react";
const Alert = ({ message, type, onClose }) => {
  // Determine Tailwind classes based on the alert type
  let colorClasses = "";
  if (type === "success") {
    colorClasses = "bg-green-100 border-green-400 text-green-700";
  } else if (type === "error") {
    colorClasses = "bg-red-100 border-red-400 text-red-700";
  } else {
    colorClasses = "bg-blue-100 border-blue-400 text-blue-700"; // Default/Info
  }

  return (
    // Fixed positioning to appear on top
    <div
      className={`fixed top-5 right-5 z-[100] border px-4 py-3 rounded shadow-lg ${colorClasses}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <strong className="font-bold mr-2">{type.toUpperCase()}:</strong>
        <span className="block sm:inline">{message}</span>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 font-bold text-xl leading-none opacity-50 hover:opacity-100`}
            aria-label="Close"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
