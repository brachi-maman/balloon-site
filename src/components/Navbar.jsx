import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
    };

    fetchProfile();
  }, [user]);

  return (

    <nav className="bg-green-300 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-row-reverse items-center justify-between">
        {/* לוגו - ימין */}
        <img src={logo} className="h-24 object-contain" />

        {/* קישורים - אמצע */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-pink-500 transition">בית</Link>
          <Link to="/products" className="hover:text-pink-500 transition">מוצרים</Link>
        </div>

        {/* משתמש - שמאל */}
        <div className="relative flex items-center gap-4">

          {/* סל - הכי בצד */}
          <Link to="/cart" className="hover:text-pink-500 transition flex items-center gap-1 ml-auto">
            <ShoppingCart size={20} />
          </Link>
          {user ? (
            <>
              <button
                onClick={() => setOpen(!open)}>
                <div className="w-10 h-10 bg-pink-500 text-white flex items-center justify-center rounded-full text-sm">
                  {profile?.name?.[0] || "User"}
                </div>
              </button>

              {open && (
                <div className="absolute left-0 mt-2 w-44 bg-white shadow-lg rounded-xl overflow-hidden">
                  <Link
                    to="/my-orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    ההזמנות שלי
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2 hover:bg-gray-100"
                  >
                    התנתק
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                התחבר
              </Link>
              <Link to="/register" className="px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500">
                הרשמה
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}