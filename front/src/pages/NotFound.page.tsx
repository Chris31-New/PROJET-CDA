import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-400 p-6 rounded-full shadow-lg">
            <IoSearchOutline size={50} className="text-black" />
          </div>
        </div>

        <h1 className="text-7xl font-bold text-gray-800">404</h1>

        <h2 className="text-2xl font-semibold mt-4 text-gray-700">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-500">
          Oops! The page you are looking for doesn't exist or may have been
          moved.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
