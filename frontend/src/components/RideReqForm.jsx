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
  const [goingFromVit, setGoingFromVit] = useState(true);
  const [transport, setTransport] = useState("flight");

  const { alertState, displayAlert, hideAlert } = useAlert(3000);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const isTrain = transport === "train";
  const isFlight = transport === "flight";

  const handleDirectionChange = (e) => {
    const value = e.target.value;

    if (!value) return;

    if (value.includes("Rail")) {
      setTransport("train");
    } else {
      setTransport("flight");
    }

    setGoingFromVit(value.toLowerCase().startsWith("vit"));
  };

  const onSubmit = async (formData) => {
    if (!isLoggedIn || !user) {
      setShowLoginModal(true);
      return;
    }

    const payload = {
      direction: formData.direction,
      transport,
      journeyDate: formData.journeyDate,
      vehicleCapacity: Number(formData.vehicleCapacity),
      phone: String(formData.phone),
    };

    if (transport === "flight") {
      payload.journeyTime = formData.journeyTime;
      payload.tolerance = Number(formData.tolerance);
    }

    if (transport === "train") {
      payload.trainNumber = formData.trainNumber;
    }

    try {
      const res = await axios.post("/api/rides", payload, {
        withCredentials: true,
      });

      displayAlert(
        res.data.message || "Ride requested successfully!",
        "success"
      );
    } catch (e) {
      const status = e.response?.status || 503;
      const message = e.response?.data?.message || "Something went wrong";
      displayAlert(message, "error");
    }
  };

  return (
    <div className="w-full flex justify-center items-start">
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
          <h2 className="text-xl font-semibold text-center text-white">
            Search Travelmates
          </h2>

          {/* Direction */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Direction
            </label>
            <select
              {...register("direction", { required: true })}
              onChange={handleDirectionChange}
              className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white"
            >
              <option value="">Select direction</option>
              <option value="vitToChennaiAir">VIT-v → Chennai Airport</option>
              <option value="ChennaiAirtoVit">Chennai Airport → VIT-v</option>
              <option value="vitToKatpadiRail">VIT-v → Katpadi Railway</option>
              <option value="KatpadiRailToVit">Katpadi Railway → VIT-v</option>
            </select>
            {errors.direction && (
              <p className="text-red-400 text-[11px] ">
                Direction is required.
              </p>
            )}
          </div>

          {/* Date + Time / Train Number */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">
                {isFlight ? (
                  <p>Travel Date</p>
                ) : goingFromVit ? (
                  <p>Boarding Date</p>
                ) : (
                  <p>Deboarding Date</p>
                )}
              </label>
              <input
                type="date"
                {...register("journeyDate", { required: true })}
                className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white"
              />
              {errors.journeyDate && (
                <p className="text-red-400 text-[11px]">
                  Journey Date is required.
                </p>
              )}
            </div>

            {isFlight ? (
              <div>
                <label className="block text-xs font-medium text-gray-200 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  {...register("journeyTime", { required: true })}
                  className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white"
                />
                {errors.journeyTime && (
                  <p className="text-red-400 text-[11px] ">
                    Journey Time is required.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-200 mb-1">
                  Train Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  {...register("trainNumber", {
                    required: true,
                    pattern: /^[0-9]{5}$/,
                  })}
                  placeholder="eg. 12640"
                  className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white"
                />
                {errors.trainNumber && (
                  <p className="text-red-400 text-[11px] mt-1">
                    Train number must be exactly 5 digits.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Vehicle */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Vehicle
            </label>
            <select
              {...register("vehicleCapacity", { required: true })}
              className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white"
            >
              <option value={3}>Cab - 3 seats</option>
              {isTrain && <option value={2}>Auto - 2 seats</option>}
            </select>
            {errors.vehicleCapacity && (
              <p className="text-red-400 text-[11px] ">
                Vehicle selection is required.
              </p>
            )}
          </div>

          {/* Tolerance (flight only) */}
          {isFlight && (
            <div>
              <label className="block text-xs font-medium text-gray-200 mb-1">
                Flexibility
              </label>
              <select
                {...register("tolerance", { required: true })}
                className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white"
              >
                {goingFromVit ? (
                  <option value="">How early can you start?</option>
                ) : (
                  <option value="">How long can you wait?</option>
                )}
                <option value="30">30 mins</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
              </select>
              {errors.tolerance && (
                <p className="text-red-400 text-[11px]">
                  Flexibility is required.
                </p>
              )}
            </div>
          )}

          {/* Contact */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Contact No.
            </label>
            <input
              {...register("phone", {
                required: true,
                pattern: /^[0-9]{10}$/,
              })}
              type="tel"
              maxLength={10}
              placeholder="shared only with your travelmates"
              className="w-full border border-white/20 rounded-md px-2 py-1.5 text-sm bg-white/6 text-white"
            />
            {errors.phone && (
              <p className="text-red-400 text-[11px] ">
                Enter a valid 10-digit phone number.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-lime-400 to-cyan-400 text-black py-1.5 rounded-md text-sm font-medium"
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
