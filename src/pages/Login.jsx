import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 חדש
  const navigate = useNavigate();
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("שגיאה בהתחברות");
      return;
    }

    // 👇 מביאים פרופיל
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    // 👇 ניתוב לפי סוג משתמש
    if (profile?.is_admin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">

      <input
        className="border p-2 w-full mb-3"
        placeholder="אימייל"
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* סיסמה עם עין */}
      <div className="relative mb-3">
        <input
          type={showPassword ? "text" : "password"}
          className="border p-2 w-full pr-10"
          placeholder="סיסמה"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <button
        onClick={handleLogin}
        className="bg-pink-500 text-white px-4 py-2 w-full"
      >
        התחבר
      </button>
    </div>
  );
}