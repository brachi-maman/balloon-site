import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

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
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          items: cart,
          total: total,
        },
      ]);

    if (error) {
      console.log(error);
    } else {
      alert("ההזמנה נשלחה בהצלחה 🎉");
      localStorage.removeItem("cart");
      setCart([]);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">הסל שלך</h1>

      {cart.map((item, i) => (
        <div key={i} className="border p-4 mb-3 rounded-xl flex justify-between items-center">

          <div>
            <h2 className="font-bold">{item.name}</h2>
            <p>{item.price} ₪</p>

            <div className="flex gap-2 items-center mt-2">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="px-2 bg-gray-200 rounded"
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() => updateQty(item.id, 1)}
                className="px-2 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="text-red-500"
          >
            מחק
          </button>

        </div>
      ))}

      <h2 className="text-xl font-bold mt-6">
        סה״כ: {total} ₪
      </h2>
      <button
        onClick={sendOrder}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        בצע הזמנה
      </button>
    </div>

  );

}