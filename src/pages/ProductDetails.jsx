import { useParams } from "react-router-dom";
import { useState } from "react";
export default function ProductDetails() {
  const { id } = useParams();
  const [selectedColors, setSelectedColors] = useState([]);
  const [currentColor, setCurrentColor] = useState("#ff0000"); const products = [
    {
      id: 1,
      name: "קשת בלונים ליום הולדת",
      price: 250,
      image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30"
    },
    {
      id: 2,
      name: "עמדת צילום בלונים",
      price: 400,
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f"
    }
  ];

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div className="p-10">מוצר לא נמצא ❌</div>;
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        ...product, qty: 1,
        colors: selectedColors,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="mt-6">
        <p className="font-semibold mb-2">בחר צבעים לעיצוב:</p>

        {/* בורר צבע */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-14 h-14 border rounded cursor-pointer"
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

        {/* צבעים שנבחרו */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {selectedColors.map((color, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-full border shadow"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-96 object-cover rounded-2xl mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

      <p className="text-gray-600 text-xl mb-4">
        מחיר: {product.price} ₪
      </p>

      <button
        onClick={addToCart}
        className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full">
        הוסף לסל
      </button>

    </div >
  );
}