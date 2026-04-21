import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("שגיאה בהתחברות");
    } else {
      alert("התחברת בהצלחה 🎉");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <input
        className="border p-2 w-full mb-3"
        placeholder="אימייל"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="סיסמה"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-pink-500 text-white px-4 py-2 w-full"
      >
        התחבר
      </button>
    </div>
  );
}