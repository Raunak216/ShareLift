function FooterComponent() {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center  mx-10 lg:mx-20  py-8 w-4/5">
      {/* Left: Contact Form */}
      <div className="flex flex-col space-y-3 w-full md:w-1/3">
        <h2 className="text-2xl font-semibold text-cyan-300">Contact Us</h2>

        <textarea
          className="w-full h-24 p-3 text-gray-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:outline-none resize-none"
          placeholder="Send your reviews, suggestions, or complaints !"
        ></textarea>
        <button className="contactBtn text-white px-5 py-2 rounded-lg  w-2/6 lg:w-1/5">
          Send
        </button>
      </div>

      {/* Right: Credits */}
      <div className="mt-8 md:mt-0 text-center md:text-right">
        <h2 className="text-lg text-cyan-300  mb-3 lg:mr-10">
          Made with <span className="text-red-500">❤️</span> by VIT Student
        </h2>
      </div>
    </footer>
  );
}

export { FooterComponent };
