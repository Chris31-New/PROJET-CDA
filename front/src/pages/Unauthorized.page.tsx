import { Link } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-400 p-6 rounded-full shadow-lg">
            <IoWarningOutline size={50} className="text-black" />
          </div>
        </div>

        <h1 className="text-7xl font-bold text-gray-800">403</h1>

        <h2 className="text-2xl font-semibold mt-4 text-gray-700">
          Access Denied
        </h2>

        <p className="mt-3 text-gray-500">
          You don't have permission to access this page. If you think this is a
          mistake, please contact your administrator.
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
