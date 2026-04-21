import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import ProductPage from "./pages/ProductDetails";
import Register from "./pages/Register";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;