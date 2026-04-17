export default function ProductCard({ product }) {
  return (
<div className="group w-full max-w-[170px] bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border border-pink-100">
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
          חדש ✨
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1">

        <h2 className="text-sm font-bold text-gray-800 line-clamp-1">
          {product.name}
        </h2>

        <p className="text-pink-600 font-bold text-sm">
          ₪{product.price}
        </p>

        <button className="mt-2 w-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs py-2 rounded-lg hover:from-pink-600 hover:to-yellow-500 transition">
          הזמן עכשיו
        </button>
      </div>
    </div>
  )
}