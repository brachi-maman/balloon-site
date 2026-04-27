import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">הזמנות</h1>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded">
          <p>סה"כ: ₪{order.total}</p>

          {order.items.map((item, i) => (
            <div key={i}>
              {item.name} - {item.qty}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}