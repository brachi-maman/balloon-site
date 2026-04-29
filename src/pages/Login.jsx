import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⭐ שגיאות
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // ✅ ולידציה תוך כדי
  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value) error = "אימייל חובה";
      else if (!value.includes("@")) error = "אימייל לא תקין";
    }

    if (name === "password") {
      if (!value) error = "סיסמה חובה";
      else if (value.length < 6) error = "לפחות 6 תווים";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // ✅ שינוי אימייל
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateField("email", value);
  };

  // ✅ שינוי סיסמה
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validateField("password", value);
  };

  const handleLogin = async () => {
    // בדיקה אם יש שגיאות
    if (errors.email || errors.password || !email || !password) {
      toast.error("תקני את השדות לפני התחברות");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("אימייל או סיסמה שגויים");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .maybeSingle();

      toast.success("התחברת בהצלחה 🎉");

      if (profile?.is_admin) {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      toast.error("שגיאה לא צפויה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <Toaster position="top-center" />

      {/* אימייל */}
      <input
        className="border p-2 w-full mb-1"
        placeholder="אימייל"
        value={email}
        onChange={handleEmailChange}
      />
      {errors.email && (
        <p className="text-red-500 text-sm mb-2">{errors.email}</p>
      )}

      {/* סיסמה */}
      <div className="relative mb-1">
        <input
          type={showPassword ? "text" : "password"}
          className="border p-2 w-full pr-10"
          placeholder="סיסמה"
          value={password}
          onChange={handlePasswordChange}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {errors.password && (
        <p className="text-red-500 text-sm mb-2">{errors.password}</p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-pink-500 text-white px-4 py-2 w-full disabled:opacity-50"
      >
        {loading ? "מתחבר..." : "התחבר"}
      </button>
    </div>
  );
}