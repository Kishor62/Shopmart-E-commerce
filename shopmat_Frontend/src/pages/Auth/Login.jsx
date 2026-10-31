import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth, getErrorMessage } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/slices/notificationSlice";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute se aaye the to login ke baad wahin wapas (warna home)
  const redirectTo = location.state?.from?.pathname || "/";

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);

      dispatch(
        showNotification({
          message: "Logged in successfully!",
          type: "success",
        }),
      );

      navigate(redirectTo, { replace: true });
    } catch (error) {
      dispatch(
        showNotification({
          message: getErrorMessage(error, "Login failed"),
          type: "error",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50 px-4 py-12">
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-100/50 border border-white/60 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white mb-4 shadow-lg shadow-violet-200">
              <LogIn size={26} strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Login to continue shopping at ShopMart
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
              />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email Address"
                value={form.email}
                onChange={updateField}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Password"
                value={form.password}
                onChange={updateField}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-7">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
