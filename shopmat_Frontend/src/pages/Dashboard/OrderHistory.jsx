import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const { user } = useAuth();

  // Abhi dummy data — baad mein API se laana
  const orders = [
    { id: "ORD-1001", date: "12 Oct 2026", total: 2499, status: "Delivered" },
    { id: "ORD-1002", date: "05 Oct 2026", total: 1299, status: "Shipped" },
  ];

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-4">Please login to see orders</h2>
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{order.total}</p>
                <span className="inline-block mt-1 rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-700">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}