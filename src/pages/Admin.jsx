import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  Trash2,
  Pencil,
  Save,
  X,
  Plus,
  ImagePlus,
} from "lucide-react";

export default function Admin() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imageFile: null,
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔄 טעינה
  const fetchData = async () => {
    const { data: productsData } = await supabase.from("products").select("*");
    const { data: usersData } = await supabase.from("profiles").select("*");

    setProducts(productsData || []);
    setUsers(usersData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🖼 העלאת תמונה
  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.log(error);
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ➕ הוספת מוצר
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageFile) return;

    const imageUrl = await uploadImage(newProduct.imageFile);
    if (!imageUrl) return;

    await supabase.from("products").insert([
      {
        name: newProduct.name,
        price: Number(newProduct.price),
        image: imageUrl,
      },
    ]);

    setNewProduct({ name: "", price: "", imageFile: null });
    fetchData();
  };

  // ❌ מחיקה
  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  };

  // ✏️ שמירה
  const saveEdit = async () => {
    let imageUrl = editingProduct.image;

    if (editingProduct.imageFile) {
      const uploaded = await uploadImage(editingProduct.imageFile);
      if (uploaded) imageUrl = uploaded;
    }

    await supabase
      .from("products")
      .update({
        name: editingProduct.name,
        price: Number(editingProduct.price),
        image: imageUrl,
      })
      .eq("id", editingProduct.id);

    setEditingProduct(null);
    fetchData();
  };

  return (
    <div className="p-10 space-y-10" dir="rtl">

      {/* 🟣 הוספת מוצר */}
      <div className="border p-4 rounded space-y-3">
        <h1 className="text-2xl font-bold">ניהול מוצרים</h1>

        <input
          type="text"
          placeholder="שם מוצר"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="מחיר"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          type="file"
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              imageFile: e.target.files[0],
            })
          }
          className="border p-2 w-full"
        />

        <button
          onClick={addProduct}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} />
          הוסף מוצר
        </button>
      </div>

      {/* 📦 מוצרים */}
      {products.map((p) => (
        <div key={p.id} className="border p-4 rounded space-y-3">

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-4">

              <img
                src={p.image}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="text-right">
                <p className="font-bold">{p.name}</p>
                <p className="text-gray-600">₪{p.price}</p>
              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => setEditingProduct(p)}
                className="text-blue-500"
              >
                <Pencil />
              </button>

              <button
                onClick={() => deleteProduct(p.id)}
                className="text-red-500"
              >
                <Trash2 />
              </button>

            </div>
          </div>

          {/* ✏️ עריכה */}
          {editingProduct?.id === p.id && (
            <div className="border-t pt-4 space-y-3">

              <input
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                className="border p-2 w-full"
              />

              <input
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                className="border p-2 w-full"
              />

              <input
                type="file"
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    imageFile: e.target.files[0],
                  })
                }
                className="border p-2 w-full"
              />

              <div className="flex gap-2">

                <button
                  onClick={saveEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Save size={18} />
                  שמור
                </button>

                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <X size={18} />
                  ביטול
                </button>

              </div>
            </div>
          )}
        </div>
      ))}

      {/* 👤 משתמשים */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">משתמשים</h2>

        {users.map((u) => (
          <div key={u.id} className="border-b py-2">
            <p>{u.name}</p>
            <p className="text-gray-600">{u.phone}</p>
            <p className="text-gray-600">{u.address}</p>
          </div>
        ))}
      </div>

    </div>
  );
}