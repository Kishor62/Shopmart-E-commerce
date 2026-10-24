import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Agar user login nahi hai → Login page pe bhej do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User login hai → page dikhao
  return children;
}