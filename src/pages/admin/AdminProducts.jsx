import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { findAllProducts, deleteProductById } from "@/controllers/product.controller";

export default function AdminProduct() {
    const userInfo = useOutletContext();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const privilege = userInfo?.privilege?.[0]?.privilege;

    useEffect(() => {
        if (privilege !== "ADMIN") {
            navigate("/");
            return;
        }
    }, [privilege, navigate]);

    const fetchProducts = async () => {
        try {
            const res = await findAllProducts();
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Yakin ingin menghapus produk ini?");
        if (!confirm) return;

        try {
            await deleteProductById(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert("Gagal menghapus produk");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <p className="text-zinc-400">Memuat data produk...</p>;
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Manajemen Produk</h2>

            <div className="overflow-x-auto">
                <table className="
                    w-full border border-zinc-300 border-collapse
                    [&_th]:border [&_th]:border-zinc-300 [&_th]:px-3 [&_th]:py-2
                    [&_td]:border [&_td]:border-zinc-300 [&_td]:px-3 [&_td]:py-2
                ">
                    <thead className="bg-zinc-200 text-left">
                        <tr>
                            <th>No</th>
                            <th>Foto</th>
                            <th>Nama</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id} className="even:bg-zinc-50">
                                <td>{index + 1}</td>
                                <td>
                                    {product.fotoProduk?.[0]?.file ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/api/images/products/${product.fotoProduk[0].file}`}
                                            alt={product.nama}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ) : (
                                        <span className="text-xs text-zinc-400">No Image</span>
                                    )}
                                </td>
                                <td>{product.nama}</td>
                                <td>{product.kategori}</td>
                                <td>Rp {product.harga.toLocaleString()}</td>
                                <td>
                                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                                        {product.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-500 hover:underline text-sm"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
