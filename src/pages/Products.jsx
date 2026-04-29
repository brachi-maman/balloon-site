import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Products() {

  const categoryLabels = {
    BarMitzvah: "בר מצווה",
    BritAndPidyon: "ברית ופדיון",
    Brita: "בריתה",
    BatMitzvah: "בת מצווה",
    Birthday: "יום הולדת",
    Gifts: "מתנות",
    TableCenterpieces: "מרכזי שולחן",
    PhotoBooths: "עמדות צילום",
    GatesAndPillars: "שערים ועמודים",
  };

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  // 📦 טעינת מוצרים + ENUM קטגוריות
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // מוצרים
      const { data: productsData, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setProducts(productsData || []);
      setFiltered(productsData || []);

      // 🔥 שליפת ENUM מה-DB
      const { data: enumData, error: enumError } = await supabase.rpc(
        "get_product_categories"
      );

      if (enumError) {
        console.log("ENUM ERROR:", enumError);
      } else {
        setCategories(enumData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // 🔍 פילטרים
  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    setFiltered(result);
  }, [search, category, sort, products]);

  return (
    <div className="p-6" dir="rtl">

      <h1 className="text-2xl font-bold mb-6 text-right">
        המוצרים שלנו
      </h1>

      {/* פילטרים */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          type="text"
          placeholder="חיפוש מוצר..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full text-right"
        />

        {/* קטגוריות מה-ENUM */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded text-right"
        >
          <option value="all">כל הקטגוריות</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat] || cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded text-right"
        >
          <option value="default">ברירת מחדל</option>
          <option value="low">מחיר נמוך לגבוה</option>
          <option value="high">מחיר גבוה לנמוך</option>
        </select>

      </div>

      {/* טעינה */}
      {loading && (
        <p className="text-center text-gray-500">טוען מוצרים...</p>
      )}

      {/* אין מוצרים */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500">
          לא נמצאו מוצרים
        </p>
      )}

      {/* מוצרים */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}