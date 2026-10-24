export default function Loader() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-16">
      {/* Spinner */}
      <div className="relative h-16 w-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>

        {/* Spinning gradient ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-500"></div>

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <span className="text-sm font-bold text-white">S</span>
          </div>
        </div>
      </div>

      {/* Text */}
      <p className="text-sm font-medium text-slate-500">Loading...</p>
    </div>
  );
}
