import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import { useAuth } from "../Contexts/AuthContext";
import { Clock, MapPin, Users, CheckCircle } from "lucide-react";
import axios from "axios";

const ActiveRequestCard = ({ request, user }) => {
  const { direction, journeyDate, journeyTime, status, totalSeats } = request;
  const isPending = status === "pending";

  const directionMap = {
    vitToChennaiAir: "VIT-v → Chennai Airport",
    ChennaiAirtoVit: "Chennai Airport → VIT-v",
    vitToKatpadiRail: "VIT-v → Katpadi Railway",
    KatpadiRailToVit: "Katpadi Railway → VIT-v",
  };

  // Convert date to human readable
  const readableDate = new Date(journeyDate).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusBadge = isPending
    ? "bg-yellow-300/20 text-yellow-200 border border-yellow-300/40"
    : "bg-green-400/20 text-green-100 border border-green-400/40";

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg transition-transform duration-300 hover:shadow-[0_0_25px_rgba(0,255,200,0.3)] z-10">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <h3 className="text-xl md:text-3xl font-extrabold text-white drop-shadow-md text-center sm:text-left">
          Current Active Request
        </h3>
        <span
          className={`px-3 py-1 md:px-4 md:py-1 text-xs md:text-sm font-bold uppercase rounded-full ${statusBadge} self-center sm:self-auto`}
        >
          {status}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5">
        {/* Left Section */}
        <div className="space-y-4 md:space-y-5 border-b md:border-b-0 md:border-r border-white/20 pb-6 md:pb-0 md:pr-8">
          <h4 className="text-base md:text-lg font-semibold text-white/90 mb-2 md:mb-3">
            Your Journey Plan
          </h4>
          <DetailRow
            Icon={MapPin}
            label="Destination"
            value={directionMap[request.direction] || request.direction}
          />
          <DetailRow Icon={Clock} label="Time" value={journeyTime} />
          <DetailRow Icon={CheckCircle} label="Date" value={readableDate} />
        </div>

        {/* Right Section */}
        <div className="space-y-4 md:space-y-5 md:pl-8">
          <h4 className="text-base md:text-lg font-semibold text-white/90 mb-2 md:mb-3">
            Matching Status
          </h4>

          <DetailRow Icon={Users} label="Seats Needed" value={totalSeats} />

          {isPending ? (
            <p className="text-cyan-200 font-medium text-sm md:text-base">
              Searching for Travelmates now... We will notify you with updates
              on mail . Stay tuned!
            </p>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-white/90 text-sm md:text-base">
                Group Members Found:
              </p>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {request.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center text-gray-200 bg-white/5 px-3 py-2 rounded-lg text-sm"
                  >
                    <div className="flex items-center mb-1 sm:mb-0">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      <span className="font-medium mr-2">
                        {member.userId?.name || `User ${index + 1}`}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                      <span className="text-gray-400">
                        ({member.userId?.email})
                      </span>
                      <span className="text-cyan-300 font-semibold">
                        {member.userId?.phone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ Icon, label, value }) => (
  <div className="flex items-start">
    <Icon className="w-4 h-4 md:w-5 md:h-5 text-cyan-300 mr-3 mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-300">{label}</p>
      <p className="text-sm md:text-base font-medium text-white/90 break-words">
        {value}
      </p>
    </div>
  </div>
);

function MyRequestPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [activeRequest, setActiveRequest] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchActiveRequest = async () => {
        try {
          const res = await axios.get("/api/groups/my", {
            withCredentials: true,
          });
          setActiveRequest(res.data.request);
        } catch (err) {
          console.error("Failed to fetch active group:", err);
          setActiveRequest(null);
        } finally {
          setLoadingRequest(false);
        }
      };
      fetchActiveRequest();
    }
  }, [isLoggedIn]);

  if (isLoading || loadingRequest) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-animate">
        <h1 className="text-lg md:text-xl font-bold text-white text-center px-4">
          Loading your requests...
        </h1>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-animate">
        <h1 className="text-lg md:text-xl font-bold text-red-100 text-center px-4">
          Please login to view your requests.
        </h1>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="wrapper">
        <div className="gradient gradient-1"></div>
        <div className="gradient gradient-2"></div>
        <div className="gradient gradient-3"></div>
      </div>
      <main className="relative min-h-screen flex flex-col items-center justify-start py-8 md:py-16 px-3 sm:px-4 bg-gradient-animate overflow-hidden">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-6 md:mb-10 drop-shadow-lg text-center px-2">
          My Trips & Requests
        </h1>

        {activeRequest ? (
          <ActiveRequestCard request={activeRequest} user={user} />
        ) : (
          <div className="w-full max-w-xl p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl text-center text-white/90 shadow-lg border border-white/20 mx-4">
            <p className="text-sm md:text-base">
              You don't have any active requests right now.
            </p>
          </div>
        )}
      </main>
    </>
  );
}

export default MyRequestPage;
