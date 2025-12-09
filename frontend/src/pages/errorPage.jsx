export default function ErrorPage() {
  return (
    <>
      <div className="wrapper">
        <div className="gradient gradient-1"></div>
        <div className="gradient gradient-2"></div>
        <div className="gradient gradient-3"></div>
      </div>

      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
        <div className="card-form backdrop-blur-xl bg-white/20 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md text-center border border-red-300/40">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-red-500 mb-3 drop-shadow-sm">
            Something Went Wrong
          </h1>

          <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
            An unexpected error occurred - please try again later.
          </p>

          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            Reminder: Log in using your{" "}
            <span className="text-cyan-400 font-semibold">
              @vitstudent.ac.in
            </span>{" "}
            email ID only.
          </p>

          <a
            href="/"
            className="mt-6 inline-block bg-red-500/80 hover:bg-red-600 text-gray-100 px-5 py-2 rounded-xl shadow-lg backdrop-blur transition-all text-sm sm:text-base"
          >
            Go Back
          </a>
        </div>

        <p className="mt-6 text-gray-300 text-xs sm:text-sm px-4 text-center drop-shadow">
          If you believe this is a mistake, please report it.
        </p>
      </div>
    </>
  );
}
