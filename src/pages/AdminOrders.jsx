import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { User, Phone, MapPin, Package, Palette } from "lucide-react";
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // שינוי סטטוס
  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.log("UPDATE ERROR:", error);
      alert("שגיאה בעדכון סטטוס");
      return;
    }

    fetchOrders();
  };
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (

    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">ניהול הזמנות</h1>

      {/* 🔍 פילטר */}
      <div className="mb-6 flex gap-3">
        <button onClick={() => setFilter("all")}>הכל</button>
        <button onClick={() => setFilter("new")}>חדשות</button>
        <button onClick={() => setFilter("processing")}>בטיפול</button>
        <button onClick={() => setFilter("done")}>הושלם</button>
      </div>

      {filteredOrders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded shadow">

          {/* כותרת */}
          <div className="flex justify-between items-center">

            <div>
              <p className="font-bold">₪{order.total}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2 items-center">

              {/* סטטוס */}
              <select
                value={order.status || "new"}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value)
                }
                className="border p-1 rounded"
              >
                <option value="new">חדש</option>
                <option value="processing">בטיפול</option>
                <option value="done">הושלם</option>
              </select>

              {/* פתיחה / סגירה */}
              <button
                onClick={() =>
                  setOpenOrderId(
                    openOrderId === order.id ? null : order.id
                  )
                }
                className="text-blue-500"
              >
                {openOrderId === order.id ? "סגור" : "פרטים"}
              </button>
            </div>
          </div>

          {openOrderId === order.id && (
            <div className="mt-4 border-t pt-4 space-y-3 text-right">

              {/* פרטי לקוח */}
              <div className="bg-gray-50 p-3 rounded space-y-2 text-right">

                <div className="flex items-center gap-2 justify-end">
                  <p>{order.customer_name}</p>
                  <User size={16} />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <p>{order.phone}</p>
                  <Phone size={16} />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <p>{order.address}</p>
                  <MapPin size={16} />
                </div>
              </div>

              {/* מוצרים */}
              <div className="text-right">
                <p className="font-bold mb-2 flex items-center justify-end gap-2">
                  מוצרים
                  <Package size={16} />
                </p>

                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between border-b py-1">
                    <span>{item.name}</span>
                    <span>כמות: {item.qty}</span>
                  </div>
                ))}
              </div>

              {/* צבעים */}
              <div className="text-right">
                <p className="font-bold mb-2 flex items-center justify-end gap-2">
                  צבעים נבחרים
                  <Palette size={16} />
                </p>

                {order.design_colors?.length > 0 ? (
                  <div className="flex gap-2 justify-end flex-wrap">
                    {order.design_colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">לא נבחר צבע</p>
                )}
              </div>

            </div>
          )}
        </div>
      ))}
    </div>
  );
}