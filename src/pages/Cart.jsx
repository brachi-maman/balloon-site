import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { ShoppingBag } from "lucide-react";
export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);
  const updateQty = (id, delta) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    setCart(cart);
  };
  const removeItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = cart.filter(item => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty, 0);


  const sendOrder = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("צריך להתחבר לפני ביצוע הזמנה");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // 👤 מביא פרופיל כדי לקבל שם/טלפון/כתובת
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { error } = await supabase.from("orders").insert([
      {
        user_id: user.id,
        items: cart,
        total,

        // 🧾 פרטי לקוח
        customer_name: profile?.name,
        phone: profile?.phone,
        address: profile?.address,

        // 🎨 צבעים מכל המוצרים
        design_colors: cart.flatMap((item) => item.colors || []),

        // 📦 סטטוס התחלתי
        status: "new",
      },
    ]);

    if (error) {
      console.log(error);
      alert("שגיאה ביצירת הזמנה");
      return;
    }

    alert("ההזמנה נשלחה בהצלחה 🎉");

    localStorage.removeItem("cart");
    setCart([]);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        מוצרים שהוזמנו
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* 🧾 רשימת מוצרים */}
        <div className="md:col-span-2 space-y-4">
          {cart.length === 0 && (
            <p className="text-center text-gray-500">הסל ריק</p>
          )}

          {cart.map((item, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-lg border border-gray-200 p-5 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-lg transition"
            >
              <div className="flex gap-2 mt-2">
                {item.colors?.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              {/* פרטים */}
              <div>
                <h2 className="font-bold text-lg text-gray-800">
                  {item.name}
                </h2>
                <p className="text-gray-500">{item.price} ₪</p>

                {/* כמות */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="font-semibold">{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* צד ימין */}
              <div className="flex flex-col items-end gap-3">
                <p className="font-bold text-gray-800">
                  {item.price * item.qty} ₪
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  הסר ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 💳 סיכום הזמנה */}
        <div className="bg-white p-6 rounded-2xl shadow-lg h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            סיכום הזמנה
          </h2>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>סה״כ מוצרים</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between text-gray-600 mb-4">
            <span>סה״כ לתשלום</span>
            <span className="font-bold text-lg text-gray-800">
              ₪  {total}
            </span>
          </div>
          <button
            onClick={sendOrder}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition"
          >
            <ShoppingBag size={20} />
            <span>בצע הזמנה</span>
          </button>
        </div>
      </div>
    </div>
  );
}