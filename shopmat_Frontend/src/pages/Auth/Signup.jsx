import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useAuth, getErrorMessage } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/slices/notificationSlice";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const notify = (message, type = "error") =>
    dispatch(showNotification({ message, type }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Backend jaise hi rules, taaki galti pehle hi pakdi jaye
    if (form.password !== form.confirmPassword) {
      return notify("Passwords do not match!");
    }
    if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      return notify("Password must contain at least one letter and one number");
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      return notify("Enter a valid 10 digit mobile number");
    }

    setLoading(true);
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      notify("Account created successfully! Please login.", "success");
      navigate("/login", { replace: true }); // ← yahan change
    } catch (error) {
      notify(getErrorMessage(error, "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      placeholder: "Full Name",
      type: "text",
      icon: User,
      autoComplete: "name",
    },
    {
      name: "email",
      placeholder: "Email Address",
      type: "email",
      icon: Mail,
      autoComplete: "email",
    },
    {
      name: "phone",
      placeholder: "Mobile Number",
      type: "tel",
      icon: Phone,
      autoComplete: "tel",
    },
  ];

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
              <User size={26} strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Join ShopMart and start shopping today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(
              ({ name, placeholder, type, icon: Icon, autoComplete }) => (
                <div key={name} className="relative group">
                  <Icon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
                  />
                  <input
                    name={name}
                    type={type}
                    required
                    minLength={name === "name" ? 2 : undefined}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={updateField}
                    inputMode={name === "phone" ? "numeric" : undefined}
                    maxLength={name === "phone" ? 10 : undefined}
                    pattern={name === "phone" ? "[6-9][0-9]{9}" : undefined}
                    title={
                      name === "phone"
                        ? "10 digit number, 6-9 se shuru"
                        : undefined
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
                  />
                </div>
              ),
            )}

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
                minLength={8}
                autoComplete="new-password"
                placeholder="Password (min. 8, letter + number)"
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

            {/* Confirm Password */}
            <div className="relative group">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
              />
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={updateField}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
