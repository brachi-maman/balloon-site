import ProductCard from "../components/ProductCard"
export default function Products() {
 const products = [
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
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
  },
  {
    id: 3,
    name: "זר בלונים מעוצב",
    price: 120,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
  }
]

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      {/* <div className="absolute top-10 left-10 text-6xl opacity-30 animate-bounce">🎈</div> */}
      {/* <div className="absolute top-20 right-16 text-5xl opacity-25 animate-pulse">✨</div> */}
      {/* <div className="absolute bottom-20 left-20 text-5xl opacity-30 animate-bounce animation-delay-500">🎊</div> */}
      {/* <div className="absolute bottom-32 right-10 text-6xl opacity-20 animate-pulse animation-delay-1000">🎉</div> */}

      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-50"></div>
      <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-70"></div>

      {/* Header with Crazy Animations */}
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up transform hover:scale-105 transition-transform duration-500">
          המוצרים שלנו 🎈
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-lg mx-auto animate-fade-in-up animation-delay-300 transform hover:scale-105 transition-transform duration-500">
          מגוון עיצובי בלונים מיוחדים לאירועים שלכם
        </p>
        <div className="w-32 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full mx-auto mt-6 animate-pulse"></div>
      </div>

      {/* Products Grid */}
     <div className="flex justify-center px-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full max-w-7xl mx-auto">

    {products.map((product, index) => (
      <div
        key={product.id}
        className="flex justify-center"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <ProductCard product={product} />
      </div>
    ))}

  </div>
</div>

      {/* Call to Action with Animation */}
      <div className="text-center mt-20 relative z-10">
        <p className="text-gray-700 mb-8 text-lg animate-fade-in-up animation-delay-1000">
          רוצים עיצוב מותאם אישית?
        </p>
        <button className="px-10 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all duration-300 text-xl animate-pulse">
          📞 צור קשר להזמנה מיוחדת
        </button>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}