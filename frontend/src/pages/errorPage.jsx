export default function ErrorPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-2">
        Something went wrong
      </h1>
      <p className="text-lg text-gray-700">Please try again later.</p>
      <a href="/" className="mt-4 text-blue-600 underline hover:text-blue-800">
        Go back to Home
      </a>
    </div>
  );
}
