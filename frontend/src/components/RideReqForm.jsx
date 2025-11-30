import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import GoogleLogin from "../components/GoogleLogin";
import axios from "../axiosConfig.js";
import Alert from "./Alert";
import { useForm } from "react-hook-form";
import useAlert from "../utils/useAlert.js";

function RideRequestForm() {
  const { user, isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState("");
  const [goingFromVit, setGoingFromVit] = useState(true);
  const { alertState, displayAlert, hideAlert } = useAlert(3000);

  const onSubmit = async (formData) => {
    if (isLoggedIn && user) {
      try {
        const res = await axios.post("/api/rides", formData, {
          withCredentials: true,
        });
        displayAlert(
          res.data.message || "Ride requested successfully!",
          "success"
        );
      } catch (e) {
        const status = e.response ? e.response.status : 503;
        const message = e.response ? e.response.data.message : "Network Error.";
        if (status === 409) {
          displayAlert(message, "error");
        } else if (status === 400) {
          displayAlert(message || "Missing required data.", "error");
        } else {
          displayAlert(message, "error");
        }
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleDirectionChange = (e) => {
    const value = e.target.value;
    setSelectedDirection(value);
    if (value && value.toLowerCase().startsWith("vit")) {
      setGoingFromVit(true);
    } else {
      setGoingFromVit(false);
    }
  };

  return (
    <div className="w-full flex justify-center  items-start ">
      {alertState.isVisible && (
        <Alert
          message={alertState.message}
          type={alertState.type}
          onClose={hideAlert}
        />
      )}

      <div className="card-form-container w-full max-w-xs sm:max-w-sm md:max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-form w-full p-4 sm:p-5 space-y-2"
        >
          <h2 className="text-xl sm:text-xl font-semibold text-center text-white mb-1">
            Search Travelmates
          </h2>

          {/* Direction */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Direction
            </label>
            <select
              {...register("direction", { required: true })}
              onChange={(e) => {
                register("direction").onChange(e);
                handleDirectionChange(e);
              }}
              className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Select direction</option>
              <option value="vitToChennaiAir">VIT-v → Chennai Airport</option>
              <option value="ChennaiAirtoVit">Chennai Airport → VIT-v</option>
              <option value="vitToKatpadiRail">VIT-v → Katpadi Railway</option>
              <option value="KatpadiRailToVit">Katpadi Railway → VIT-v</option>
            </select>
            {errors.direction && (
              <p className="text-red-400 text-[11px] mt-1">
                Direction is required.
              </p>
            )}
          </div>

          {/* Date & Time  */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">
                Travel Date
              </label>
              <input
                type="date"
                {...register("journeyDate", { required: true })}
                className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white focus:ring-2 focus:ring-cyan-400"
              />
              {errors.journeyDate && (
                <p className="text-red-400 text-[11px] mt-1">
                  Journey Date is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">
                Time
              </label>
              <input
                type="time"
                {...register("journeyTime", { required: true })}
                className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white focus:ring-2 focus:ring-cyan-400"
              />
              {errors.journeyTime && (
                <p className="text-red-400 text-[11px] mt-1">
                  Journey Time is required
                </p>
              )}
            </div>
          </div>

          {/* Vehicle type */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Vehicle
            </label>
            <select
              {...register("vehicleCapacity", { required: true })}
              className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white focus:ring-2 focus:ring-cyan-400"
            >
              <option value={3}>Cab - 3 seats (includes you)</option>
              {/* <option value={4}>Cab - 4 seats (includes you)</option> */}
              <option value={2}>Auto - 2 seats (includes you)</option>
            </select>
            {errors.vehicleCapacity && (
              <p className="text-red-400 text-[11px] mt-1">Required</p>
            )}
          </div>

          {/* Tolerance */}

          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Flexibility
            </label>
            <select
              {...register("tolerance", { required: true })}
              className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white focus:ring-2 focus:ring-cyan-400"
            >
              {goingFromVit ? (
                <option value="">How early can you start your journey? </option>
              ) : (
                <option value="">
                  How long are you willing to wait for others?
                </option>
              )}

              <option value="30">30 mins</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
            </select>
            {errors.tolerance && (
              <p className="text-red-400 text-[11px] mt-1">
                flexiblity is required
              </p>
            )}
          </div>

          {/* Contact No */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Contact No.
            </label>
            <input
              {...register("phone", {
                required: true,
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone must be exactly 10 digits",
                },
              })}
              type="tel"
              maxLength={10}
              placeholder="shared only with your travelmates"
              className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white focus:ring-2 focus:ring-cyan-400"
            />
            {errors.phone && (
              <p className="text-red-400 text-[11px] mt-1">
                Contact info is required
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-lime-400 to-cyan-400 text-black py-1.5 rounded-md text-sm font-medium hover:opacity-95 transition"
          >
            {isSubmitting ? "Submitting..." : "Search"}
          </button>
        </form>
      </div>

      {showLoginModal && (
        <GoogleLogin
          open={showLoginModal}
          onclose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}

export default RideRequestForm;
