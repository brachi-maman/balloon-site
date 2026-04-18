import ProductCard from "../components/ProductCard";
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
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f"
        }
    ];

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