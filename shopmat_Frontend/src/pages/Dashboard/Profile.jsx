import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  ShoppingBag,
  Heart,
  MapPin,
  Star,
  LogOut,
  LayoutDashboard,
  Pencil,
  Mail,
  Phone,
  CalendarDays,
  Camera,
  Wallet,
  ArrowRight,
  ShieldCheck,
  X,
  Settings,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  location: "",
};

function getProfileData(user) {
  return {
    name: user?.name || user?.fullName || user?.username || "",
    email: user?.email || "",
    phone: user?.phone || user?.phoneNumber || "",
    gender: user?.gender || "",
    dob: user?.dob || user?.dateOfBirth || "",
    location:
      typeof user?.address === "string" ? user.address : user?.location || "",
  };
}

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(emptyProfile);
  const [form, setForm] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState("");
  const [activeMenu, setActiveMenu] = useState("My Profile");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const userData = getProfileData(user);
    setProfile(userData);
    setForm(userData);
  }, [user]);

  const stats = [
    {
      label: "Total Orders",
      value: "12",
      icon: ShoppingBag,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Wishlist Items",
      value: "8",
      icon: Heart,
      bg: "bg-pink-50",
      color: "text-pink-600",
    },
    {
      label: "Average Rating",
      value: "4.5",
      icon: Star,
      bg: "bg-orange-50",
      color: "text-orange-500",
    },
    {
      label: "Total Spent",
      value: "₹24,850",
      icon: Wallet,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
  ];

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Profile", icon: UserRound, path: "/profile" },
    { label: "My Orders", icon: ShoppingBag, path: "/order-history" },
    { label: "Wishlist", icon: Heart, path: "/wishlist" },
    { label: "Addresses", icon: MapPin, path: "/addresses" },
    { label: "Reviews", icon: Star, path: "/reviews" },
  ];

  const quickActions = [
    {
      label: "My Orders",
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
      path: "/order-history",
    },
    {
      label: "My Wishlist",
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-50",
      path: "/wishlist",
    },
    {
      label: "Manage Addresses",
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      path: "/addresses",
    },
    {
      label: "Security Settings",
      icon: ShieldCheck,
      color: "text-purple-600",
      bg: "bg-purple-50",
      path: "/change-password",
    },
  ];

  const openEdit = () => {
    setForm({ ...profile });
    setSaveMessage("");
    setEditing(true);
  };

  // Updates local state only; connect your backend API for permanent saving.
  const saveProfile = (e) => {
    e.preventDefault();

    const updatedProfile = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
    };

    setProfile(updatedProfile);
    setEditing(false);
    setSaveMessage(
      "Profile updated on this page. Connect the profile API to save permanently.",
    );
  };

  const choosePhoto = (e) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6">
        <UserRound size={48} className="text-blue-600" />
        <h1 className="text-xl font-bold">Please log in first</h1>
        <p className="text-center text-sm text-gray-500">
          Login to view your profile information.
        </p>
        <Link
          to="/login"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={34} />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-bold">
                  {profile.name || "Your Name"}
                </h3>

                <p className="truncate text-xs text-slate-500">
                  {profile.email}
                </p>

                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Logged In
                </span>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map(({ label, icon: Icon, path }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setActiveMenu(label)}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 font-medium transition ${
                    activeMenu === label
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-white hover:text-blue-600"
                  }`}
                >
                  <Icon size={21} />
                  {label}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={21} />
                Logout
              </button>
            </nav>

            <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <ShoppingBag size={35} />
              </div>

              <h3 className="text-lg font-extrabold">
                Shop Smart
                <br />
                Shop Better
              </h3>

              <Link
                to="/products"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0">
          {/* Profile Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-violet-500 p-6 text-white shadow-xl shadow-blue-100 sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute bottom-[-90px] left-1/3 h-56 w-56 rounded-full bg-white/10" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative mx-auto shrink-0 sm:mx-0">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white/20 text-white shadow-xl sm:h-36 sm:w-36">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={75} strokeWidth={1.3} />
                    )}
                  </div>

                  <label className="absolute bottom-1 right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-4 border-blue-500 bg-white text-blue-600 transition hover:scale-105">
                    <Camera size={19} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={choosePhoto}
                    />
                  </label>
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="flex flex-wrap items-center justify-center gap-2 text-2xl font-extrabold sm:justify-start sm:text-3xl">
                    {profile.name || "Your Name"}
                    <ShieldCheck size={25} />
                  </h1>

                  <p className="mt-2 flex items-center justify-center gap-2 break-all text-sm text-blue-50 sm:justify-start sm:text-base">
                    <Mail size={18} className="shrink-0" />
                    {profile.email}
                  </p>

                  <p className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-2 text-sm text-white">
                    <CalendarDays size={16} className="mr-2" />
                    Account Profile
                  </p>
                </div>
              </div>

              <button
                onClick={openEdit}
                className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 xl:self-start"
              >
                <Pencil size={17} />
                Edit Profile
              </button>
            </div>

            {/* Statistics */}
            <div className="relative mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {stats.map(({ label, value, icon: Icon, bg, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/95 p-3 text-slate-900 sm:p-4"
                >
                  <div className={`rounded-xl p-2.5 ${bg} ${color}`}>
                    <Icon size={23} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-lg font-extrabold sm:text-xl">
                      {value}
                    </p>
                    <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {saveMessage && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700"
            >
              {saveMessage}
            </div>
          )}

          {/* Information and Quick Actions */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-3 text-lg font-bold sm:text-xl">
                  <UserRound className="text-blue-600" size={24} />
                  Personal Information
                </h2>

                <button
                  onClick={openEdit}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Full Name", value: profile.name, icon: UserRound },
                  { label: "Email Address", value: profile.email, icon: Mail },
                  { label: "Phone Number", value: profile.phone, icon: Phone },
                  { label: "Gender", value: profile.gender, icon: UserRound },
                  {
                    label: "Date of Birth",
                    value: profile.dob || "Not provided",
                    icon: CalendarDays,
                  },
                  {
                    label: "Location",
                    value: profile.location || "Not provided",
                    icon: MapPin,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="grid grid-cols-[24px_minmax(90px,0.8fr)_minmax(0,1.2fr)] items-start gap-3 sm:gap-4"
                  >
                    <Icon size={20} className="mt-0.5 text-slate-400" />

                    <span className="text-sm text-slate-500 sm:text-base">
                      {label}
                    </span>

                    <span className="break-words text-sm font-semibold text-slate-800 sm:text-base">
                      {value || "Not provided"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-6 flex items-center gap-3 text-lg font-bold sm:text-xl">
                <Settings className="text-blue-600" size={23} />
                Quick Actions
              </h2>

              <div className="space-y-3">
                {quickActions.map(({ label, icon: Icon, color, bg, path }) => (
                  <Link
                    key={label}
                    to={path}
                    className={`flex w-full items-center justify-between rounded-2xl p-4 transition hover:brightness-95 ${bg}`}
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold sm:text-base">
                      <Icon size={21} className={color} />
                      {label}
                    </span>

                    <ArrowRight size={19} className={color} />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Account Statistics */}
          <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 text-lg font-bold sm:text-xl">
                <LayoutDashboard className="text-blue-600" size={23} />
                Account Statistics
              </h2>

              <Link
                to="/order-history"
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Orders <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {stats.map(({ label, value, icon: Icon, bg, color }) => (
                <div
                  key={label}
                  className={`flex items-center gap-4 rounded-2xl border border-slate-100 p-4 ${bg}`}
                >
                  <div className="rounded-full bg-white/80 p-3">
                    <Icon size={25} className={color} />
                  </div>

                  <div>
                    <p className="text-xl font-extrabold">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mobile Navigation */}
          <nav className="mt-6 grid grid-cols-2 gap-3 lg:hidden">
            {menuItems.map(({ label, icon: Icon, path }) => (
              <Link
                key={label}
                to={path}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 text-sm font-medium text-slate-700"
              >
                <Icon size={19} className="text-blue-600" />
                {label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl border border-red-100 bg-white p-4 text-sm font-medium text-red-600"
            >
              <LogOut size={19} />
              Logout
            </button>
          </nav>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditing(false);
          }}
        >
          <form
            onSubmit={saveProfile}
            className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">Edit Profile</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your personal information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditing(false)}
                aria-label="Close edit form"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { key: "name", label: "Full Name", type: "text" },
                { key: "email", label: "Email Address", type: "email" },
                { key: "phone", label: "Phone Number", type: "tel" },
                { key: "dob", label: "Date of Birth", type: "date" },
                { key: "location", label: "Location", type: "text" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    {label}
                  </label>

                  <input
                    id={key}
                    type={type}
                    required={["name", "email"].includes(key)}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="gender"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
