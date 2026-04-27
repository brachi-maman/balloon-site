import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, profile } = useAuth();

  // לא מחובר → ללוגין
  if (!user) {
    return <Navigate to="/login" />;
  }

  // לא אדמין → הביתה
  if (!profile?.is_admin) {
    return <Navigate to="/" />;
  }

  // כן אדמין → מאפשר גישה
  return children;
}