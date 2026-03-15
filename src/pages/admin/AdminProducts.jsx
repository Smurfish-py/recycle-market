import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { findAllProducts, deleteProductById } from "@/controllers/product.controller";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AdminProduct() {
    const userInfo = useOutletContext();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const privilege = userInfo?.privilege?.[0]?.privilege;

    useEffect(() => {
        if (userInfo !== null) {
            if (privilege !== "ADMIN") {
                navigate("/");
            }
        }
    }, [userInfo, privilege, navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
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

    // Logika Pencarian
    const filteredProducts = products.filter(product => 
        product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="w-full flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-semibold">Manajemen Produk</h2>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5 outline-none transition-all"
                        placeholder="Cari nama atau kategori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4">No</th>
                                <th className="px-6 py-4">Foto</th>
                                <th className="px-6 py-4">Nama Produk</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Harga</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                            Memuat data produk...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">
                                        {searchTerm ? "Produk tidak ditemukan." : "Belum ada produk terdaftar."}
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr key={product.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            {product.fotoProduk?.[0]?.file ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/api/images/products/${product.fotoProduk[0].file}`}
                                                    alt={product.nama}
                                                    className="w-12 h-12 object-cover rounded-md border border-zinc-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 border border-zinc-200">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{product.nama}</td>
                                        <td className="px-6 py-4">{product.kategori}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Rp {product.harga.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => navigate(`/product/${product.id}`)}
                                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="font-medium text-red-600 hover:text-red-800 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}