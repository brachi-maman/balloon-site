import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [currentColor, setCurrentColor] = useState("#ff0000");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
      } else {
        setProduct(data);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="p-10 text-right">טוען מוצר...</div>;
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        ...product,
        qty: 1,
        colors: selectedColors,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="p-10 max-w-4xl mx-auto" dir="rtl">

      {/* 🖼 תמונה */}
      <div className="mb-6 flex justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-[450px] w-auto object-contain rounded-2xl shadow"
        />
      </div>

      {/* שם + מחיר */}
      <div className="text-right mb-6">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        <p className="text-gray-600 text-xl">
          מחיר: {product.price} ₪
        </p>
      </div>

      {/* צבעים */}
      <div className="text-right mb-6">
        <p className="font-semibold mb-2">בחר צבעים לעיצוב:</p>

        <div className="flex items-center gap-3 justify-end">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-12 h-12 border rounded cursor-pointer"
          />

          <button
            onClick={() =>
              setSelectedColors([...selectedColors, currentColor])
            }
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            הוסף צבע
          </button>
        </div>

        <div className="flex gap-3 mt-4 flex-wrap justify-end">
          {selectedColors.map((color, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-full border shadow"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* כפתור */}
      <button
        onClick={addToCart}
        className="bg-pink-500 text-white px-4 py-3 rounded-lg w-full text-lg"
      >
        הוסף לסל
      </button>
    </div>
  );
}