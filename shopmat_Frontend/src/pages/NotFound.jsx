import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="container-app py-24 text-center">
      <h1 className="text-7xl font-black text-indigo-600">404</h1>
      <p className="mt-3 text-xl">Page not found.</p>
      <Link to="/" className="btn-primary mt-7">
        Back Home
      </Link>
    </section>
  );
}
