import { useState } from "react";
import { supabase } from "../services/supabase";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

// ✅ סכימת ולידציה
const schema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  email: z.string().email("אימייל לא תקין"),
  phone: z.string().regex(/^05\d{8}$/, "טלפון חייב להתחיל ב-05 ולהיות 10 ספרות"),
  address: z.string().min(3, "כתובת קצרה מדי"),
  password: z.string().min(6, "סיסמה לפחות 6 תווים"),
});
export default function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", // 🔥 ולידציה תוך כדי כתיבה
  });

  const onSubmit = async (formData) => {
    if (loading) return;
    setLoading(true);

    try {
      // 🔐 הרשמה
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("האימייל כבר רשום במערכת");
          return;
        }
        throw error;
      }

      const user = data.user;

      if (!user) {
        toast.error("לא התקבל משתמש מהשרת");
        return;
      }

      // 👤 יצירת פרופיל
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
          },
        ]);

      if (profileError) {
        toast.error("נרשמת אבל הייתה בעיה ביצירת פרופיל");
        return;
      }

      toast.success("נרשמת בהצלחה");
      reset();

    } catch (err) {
      toast.error("שגיאה בהרשמה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <Toaster />

      <h1 className="text-2xl font-bold mb-6 text-center">הרשמה</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* שם */}
        <div>
          <input
            {...register("name")}
            placeholder="שם"
            className="border p-2 w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* טלפון */}
        <div>
          <input
            {...register("phone")}
            placeholder="טלפון"
            className="border p-2 w-full"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* כתובת */}
        <div>
          <input
            {...register("address")}
            placeholder="כתובת"
            className="border p-2 w-full"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* אימייל */}
        <div>
          <input
            {...register("email")}
            placeholder="אימייל"
            className="border p-2 w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* סיסמה */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="סיסמה"
            {...register("password")}
            className="border p-2 w-full pr-10"
          />

          {/* כפתור עין */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition"          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-500 text-white px-4 py-2 w-full rounded disabled:opacity-50"
        >
          {loading ? "טוען..." : "הרשמה"}
        </button>
      </form>
    </div>
  );
}