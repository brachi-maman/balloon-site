import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      // 👇 מביאים משתמש
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("צריך להתחבר");
        return;
      }

      // 👇 מביאים רק את ההזמנות שלו
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setOrders(data);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ההזמנות שלי</h1>

      {orders.length === 0 && <p>אין הזמנות עדיין</p>}

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded-xl">

          <p className="text-sm text-gray-500 mb-2">
            תאריך: {new Date(order.created_at).toLocaleString("he-IL")}
          </p>

          {/* מוצרים בהזמנה */}
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.name}</span>
              <span>
                {item.qty} × {item.price} ₪
              </span>
            </div>
          ))}

          <p className="font-bold mt-3">
            סה״כ: {order.total} ₪
          </p>

        </div>
      ))}
    </div>
  );
}