import { useState } from "react";
import axios from "../axiosConfig";
import Alert from "./Alert";
import useAlert from "../utils/useAlert";
import { useAuth } from "../Contexts/AuthContext";
function FooterComponent() {
  const { user, isLoggedIn } = useAuth();
  const { alertState, displayAlert, hideAlert } = useAlert(3000);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const HandleContactMe = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      displayAlert("Please Sign In to send message", "error");
      return;
    }
    if (messageText.length === 0) {
      displayAlert("Message cannot be empty.", "error");
      return;
    }
    setIsSending(true);
    try {
      await axios.post(
        "/api/send-feedback",
        {
          userName: user.name,
          recipientEmail: user.email,
          message: messageText,
        },
        {
          withCredentials: true,
        }
      );
      displayAlert("Message sent successfully", "success");
      setMessageText("");
    } catch (e) {
      console.error(e);
      displayAlert("Something went wrong, please try again later", "error");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center  mx-10 lg:mx-20  py-8 w-4/5">
      {alertState.isVisible && (
        <Alert
          message={alertState.message}
          type={alertState.type}
          onClose={hideAlert}
        />
      )}
      {/* Left: Contact Form */}
      <div className="flex flex-col space-y-3 w-full md:w-1/3">
        <h2 className="text-2xl font-semibold text-cyan-300">Contact Us</h2>

        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="w-full h-24 p-3 text-gray-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:outline-none resize-none"
          placeholder="Send your reviews, suggestions, or complaints !"
          disabled={isSending}
        ></textarea>
        <button
          onClick={HandleContactMe}
          disabled={isSending}
          className="contactBtn text-white px-5 py-2 rounded-lg  w-2/6 lg:w-1/5"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="mt-8 md:mt-0 text-center md:text-right">
        <h2 className="text-lg text-cyan-300  mb-3 lg:mr-10">
          Made with <span className="text-red-500">❤️</span> by VIT Student
        </h2>
      </div>
    </footer>
  );
}

export { FooterComponent };
