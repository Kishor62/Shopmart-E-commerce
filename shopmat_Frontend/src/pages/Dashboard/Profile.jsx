import { useAuth } from "../../context/AuthContext"; 
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-4">Please login to view profile</h2>
        <Link to="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.fullName || "User"}</h2>
            <p className="text-gray-500 text-sm">{user.email || "No email"}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p><span className="font-medium text-gray-700">Name:</span> {user.fullName}</p>
          <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
        </div>

        <Link
          to="/settings"
          className="inline-block mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}