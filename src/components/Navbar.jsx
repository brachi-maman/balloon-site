import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-pink-500 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* לוגו */}
        <h1 className="text-xl font-bold">🎈 Balloon Site</h1>

        {/* קישורים */}
        <div className="flex gap-6">
          <Link to="/" className="hover:underline">בית</Link>
          <Link to="/products" className="hover:underline">מוצרים</Link>
          <Link to="/cart" className="hover:underline">סל</Link>
          <Link to="/my-orders">ההזמנות שלי</Link>
          <Link to="/register">הרשמה</Link>
        </div>

      </div>
    </nav>
  );
}