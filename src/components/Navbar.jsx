import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="bg-pink-200 p-4 flex justify-between">
      <h1 className="font-bold text-lg">🎈 Balloon</h1>

      <div className="flex gap-4">
        <Link to="/">בית</Link>
        <Link to="/products">מוצרים</Link>
        <Link to="/cart">סל</Link>
      </div>
    </nav>
  )
}

export default Navbar