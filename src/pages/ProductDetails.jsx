import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">דף מוצר</h1>
      <p className="mt-4">ID של המוצר: {id}</p>
    </div>
  );
}