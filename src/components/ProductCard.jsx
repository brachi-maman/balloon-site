import { useNavigate } from "react-router-dom";
export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
    >

      {/* תמונה */}
      <div className="relative group h-48 w-full overflow-hidden rounded-t-2xl">

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
        />

        {/* שכבת hover שחורה */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300"></div>

      </div>

      {/* תוכן */}
      <div className="p-4 text-center">
        <h2 className="text-lg font-bold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-3">{product.price} ₪</p>

        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 w-full">
          לפרטים
        </button>
      </div>

    </div>
  );
}