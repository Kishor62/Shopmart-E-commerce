import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user, login } = useAuth(); // login se update bhi kar sakte ho
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = (e) => {
    e.preventDefault();
    // Yahan aap API call kar sakte ho
    login({ ...user, fullName: name, email });
    alert("Settings updated successfully!");
  };

  if (!user) {
    return <div className="p-10 text-center">Please login first</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <form onSubmit={handleSave} className="bg-white rounded-xl border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}