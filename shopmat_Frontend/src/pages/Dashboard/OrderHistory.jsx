
import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
  ShoppingBag,
} from "lucide-react";

const orders = [
  {
    id: "ORD-2025-0014",
    date: "Apr 28, 2025",
    time: "2:30 PM",
    product: "Wireless Earbuds",
    price: 2499,
    qty: 1,
    status: "Delivered",
  },
  {
    id: "ORD-2025-0013",
    date: "Apr 25, 2025",
    time: "11:15 AM",
    product: "Smart Watch",
    price: 1999,
    qty: 1,
    status: "Shipped",
  },
  {
    id: "ORD-2025-0012",
    date: "Apr 20, 2025",
    time: "5:45 PM",
    product: "Bluetooth Headphones",
    price: 3499,
    qty: 1,
    status: "Processing",
  },
  {
    id: "ORD-2025-0011",
    date: "Apr 15, 2025",
    time: "10:20 AM",
    product: "Mobile Phone Case",
    price: 1499,
    qty: 1,
    status: "Cancelled",
  },
];

const statusStyles = {
  Delivered: "bg-green-50 text-green-700",
  Shipped: "bg-blue-50 text-blue-700",
  Processing: "bg-orange-50 text-orange-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const statusIcons = {
  Delivered: CheckCircle,
  Shipped: Truck,
  Processing: Clock,
  Cancelled: XCircle,
};

export default function OrderHistory() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "All" || order.status === filter;

    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Order History
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage your orders
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order or product..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = statusIcons[order.status];

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">
                      Order #{order.id}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Placed on: {order.date} • {order.time}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${statusStyles[order.status]}`}
                    >
                      <StatusIcon size={16} />
                      {order.status}
                    </span>

                    <p className="text-lg font-bold text-gray-900">
                      ₹{order.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
                      <Package size={30} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {order.product}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {order.qty} • ₹
                        {order.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                  >
                    <Eye size={18} />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-16 text-center">
              <Package
                size={42}
                className="mx-auto mb-3 text-gray-300"
              />
              <h3 className="font-semibold text-gray-800">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try another search or status filter.
              </p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-detail-title"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2
                  id="order-detail-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  aria-label="Close order details"
                  className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Order ID
              </p>
              <p className="mb-4 font-semibold text-gray-900">
                {selectedOrder.id}
              </p>

              <p className="text-sm text-gray-500">Product</p>
              <p className="mb-4 font-semibold text-gray-900">
                {selectedOrder.product}
              </p>

              <p className="text-sm text-gray-500">Order Date</p>
              <p className="mb-4 font-semibold text-gray-900">
                {selectedOrder.date} • {selectedOrder.time}
              </p>

              <p className="text-sm text-gray-500">Status</p>
              <p className="mb-4 font-semibold text-gray-900">
                {selectedOrder.status}
              </p>

              <div className="mb-6 flex justify-between border-t border-gray-100 pt-4">
                <span className="font-medium text-gray-600">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{selectedOrder.price.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
