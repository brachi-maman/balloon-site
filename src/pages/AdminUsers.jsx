import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import {
    User,
    Phone,
    MapPin,
    Shield,
    Trash2,
    RefreshCcw,
    Eye,
    Lock,
    Crown,
} from "lucide-react";

export default function AdminUsers() {
    const { profile } = useAuth();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // 📥 שליפת משתמשים (בלי מחוקים)
    const fetchUsers = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("is_deleted", false)
            .order("created_at", { ascending: false });

        if (error) {
            console.log("ERROR:", error);
        } else {
            setUsers(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (profile?.is_admin) {
            fetchUsers();
        }
    }, [profile]);

    if (!profile) return <div className="p-10">טוען...</div>;
    if (!profile.is_admin) return <div className="p-10">אין לך הרשאה</div>;

    // 🔍 חיפוש
    const filteredUsers = users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase())
    );

    // 🗑 soft delete
    const hideUser = async (id) => {
        const confirmDelete = confirm("להסתיר את המשתמש?");
        if (!confirmDelete) return;

        const { error } = await supabase
            .from("profiles")
            .update({ is_deleted: true })
            .eq("id", id);

        if (error) {
            alert("שגיאה");
            return;
        }

        fetchUsers();
    };

    // 👑 אדמין
    const toggleAdmin = async (user) => {
        await supabase
            .from("profiles")
            .update({ is_admin: !user.is_admin })
            .eq("id", user.id);

        fetchUsers();
    };

    // 🔒 חסימה
    const toggleBlock = async (user) => {
        await supabase
            .from("profiles")
            .update({ is_blocked: !user.is_blocked })
            .eq("id", user.id);

        fetchUsers();
    };

    // ⭐ VIP
    const toggleVIP = async (user) => {
        await supabase
            .from("profiles")
            .update({ is_vip: !user.is_vip })
            .eq("id", user.id);

        fetchUsers();
    };

    // 🧾 הערת אדמין
    const updateNote = async (user, note) => {
        await supabase
            .from("profiles")
            .update({ admin_note: note })
            .eq("id", user.id);
    };

    // 🟢 סטטוס
    const getStatus = (u) => {
        if (u.is_blocked) return "חסום";
        if (!u.created_at) return "חדש";
        return "פעיל";
    };

    return (
        <div className="p-10" dir="rtl">
            {/* כותרת */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">ניהול משתמשים</h1>

                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded"
                >
                    <RefreshCcw size={16} />
                    רענן
                </button>
            </div>

            {/* חיפוש */}
            <input
                type="text"
                placeholder="חיפוש לפי שם..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-full mb-6 text-right"
            />

            {loading && <p className="text-center">טוען...</p>}

            <div className="space-y-4">
                {filteredUsers.map((u) => (
                    <div
                        key={u.id}
                        className="bg-white border rounded-xl shadow-sm p-5 flex justify-between"
                    >
                        {/* פרטים */}
                        <div className="space-y-2">

                            <div className="flex flex-row-reverse items-center gap-2">
                                <User size={16} />
                                <p>{u.name}</p>
                            </div>

                            <div className="flex flex-row-reverse items-center gap-2">
                                <Phone size={16} />
                                <p>{u.phone}</p>
                            </div>

                            <div className="flex flex-row-reverse items-center gap-2">
                                <MapPin size={16} />
                                <p>{u.address}</p>
                            </div>

                            <div className="flex flex-row-reverse items-center gap-2">
                                <Shield size={16} />
                                <p>{u.is_admin ? "מנהל" : "משתמש"}</p>
                            </div>

                            <p>סטטוס: {getStatus(u)}</p>

                            <p>VIP: {u.is_vip ? "⭐ כן" : "לא"}</p>

                            <p>נרשם בתאריך: {new Date(u.created_at).toLocaleDateString()}</p>

                            <p>סה״כ הוצאות: ₪{u.total_spent || 0}</p>

                            {/* הערה */}
                            <textarea
                                defaultValue={u.admin_note || ""}
                                onBlur={(e) => updateNote(u, e.target.value)}
                                placeholder="הערת אדמין..."
                                className="border rounded p-1 w-full"
                            />
                        </div>

                        {/* פעולות */}
                        <div className="flex flex-col gap-2">

                            <button
                                onClick={() => toggleAdmin(u)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                👑 אדמין
                            </button>

                            <button
                                onClick={() => toggleBlock(u)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <Lock size={16} />
                                {u.is_blocked ? "בטל חסימה" : "חסום"}
                            </button>

                            <button
                                onClick={() => toggleVIP(u)}
                                className="bg-purple-500 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <Crown size={16} />
                                VIP
                            </button>

                            <button
                                onClick={() => hideUser(u.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <Trash2 size={16} />
                                הסתר
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}