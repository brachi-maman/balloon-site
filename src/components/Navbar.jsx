import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useRef, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // סגירה בלחיצה מחוץ לתפריט
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const testLogout = async () => {
    console.log("TEST BEFORE");

    const { data, error } = await supabase.auth.signOut();

    console.log("TEST AFTER", { data, error });
  };

  const handleLogout = async () => {
    console.log("🔴 Logout clicked");

    try {
      console.log("🟡 Before signOut");

      const res = await supabase.auth.signOut();

      console.log("🟢 AFTER signOut:", res);

    } catch (err) {
      console.log("💥 ERROR:", err);
    }
  };

  return (
    <nav className="bg-green-300 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-row-reverse items-center justify-between">

        {/* צד ימין - לוגו */}
        <img src={logo} alt="logo" className="h-20 object-contain" />

        {/* אמצע - ניווט */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-pink-500">בית</Link>
          <Link to="/products" className="hover:text-pink-500">מוצרים</Link>

          {/* אדמין */}
          {profile?.is_admin && (
            <div className="flex gap-4 items-center">

              <Link to="/admin" className="text-yellow-300 font-bold hover:underline">
                ניהול מוצרים
              </Link>

              <Link to="/admin/orders" className="text-yellow-300 hover:underline">
                הזמנות
              </Link>

              <Link to="/admin/users" className="text-yellow-300 hover:underline">
                משתמשים
              </Link>

            </div>
          )}
        </div>

        {/* צד שמאל */}
        <div className="flex items-center gap-4">

          {/* סל */}
          <Link to="/cart" className="hover:text-pink-500 flex items-center">
            <ShoppingCart size={22} />
          </Link>

          {/* משתמש */}
          {user ? (
            <div ref={dropdownRef} className="relative">

              {/* עיגול משתמש */}
              <div
                onClick={() => setOpen(!open)}
                className="w-20 h-20 bg-pink-500 text-white flex items-center justify-center rounded-full cursor-pointer font-bold"
              >
                {profile?.name ? <div className="name">{profile.name}</div> : <div className="email">{user.email}</div> || "U"}
              </div>

              {/* dropdown */}
              {open && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden border z-50">

                  <Link
                    to="/my-orders"
                    className="block text-right px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    ההזמנות שלי
                  </Link>

                  <button
                    onClick={testLogout}
                    className="w-full text-right px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    התנתק
                  </button>

                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                התחבר
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
              >
                הרשמה
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}