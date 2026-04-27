import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔄 טעינת נתונים
  const fetchData = async () => {
    const { data: productsData } = await supabase.from("products").select("*");
    const { data: ordersData } = await supabase.from("orders").select("*");
    const { data: usersData } = await supabase.from("profiles").select("*");

    setProducts(productsData || []);
    setOrders(ordersData || []);
    setUsers(usersData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ הוספת מוצר
  const addProduct = async () => {
    const name = prompt("שם מוצר:");
    const price = prompt("מחיר:");
    const image = prompt("URL תמונה:");

    if (!name || !price) return;

    await supabase.from("products").insert([
      { name, price: Number(price), image },
    ]);

    fetchData();
  };

  // ❌ מחיקה
  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  };

  // ✏️ עדכון
  const updateProduct = async (id) => {
    const price = prompt("מחיר חדש:");

    if (!price) return;

    await supabase
      .from("products")
      .update({ price: Number(price) })
      .eq("id", id);

    fetchData();
  };

  return (
    <div className="p-10 space-y-10">

      {/* 🟣 מוצרים */}
      <div>
        <h1 className="text-2xl font-bold mb-4">ניהול מוצרים</h1>

        <button
          onClick={addProduct}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          הוסף מוצר
        </button>

        {products.map((p) => (
          <div key={p.id} className="border p-4 mb-2 flex justify-between">
            <div>
              {p.name} - ₪{p.price}
            </div>

            <div className="flex gap-2">
              <button onClick={() => updateProduct(p.id)}>✏️</button>
              <button onClick={() => deleteProduct(p.id)}>❌</button>
            </div>
          </div>
        ))}
      </div>

      {/* 🟡 הזמנות */}
      <div>
        <h1 className="text-2xl font-bold mb-4">הזמנות</h1>

        {orders.map((o) => (
          <div key={o.id} className="border p-4 mb-2">
            <p>סה"כ: ₪{o.total}</p>

            {o.items?.map((item, i) => (
              <div key={i}>
                {item.name} - {item.qty}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 🔵 משתמשים */}
      <div>
        <h1 className="text-2xl font-bold mb-4">משתמשים</h1>

        {users.map((u) => (
          <div key={u.id} className="border p-4 mb-2">
            <p>{u.name}</p>
            <p>{u.phone}</p>
            <p>{u.address}</p>
          </div>
        ))}
      </div>

    </div>
  );
}