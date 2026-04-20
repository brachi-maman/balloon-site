import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
export default function Products() {
    const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      console.log("ERROR:", error);
    } else {
      console.log("DATA:", data); // 👈 חשוב לבדיקה
      setProducts(data);
    }
  };

  fetchProducts();
}, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">המוצרים שלנו</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}