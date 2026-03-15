import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon, ArrowTopRightOnSquareIcon, ShoppingCartIcon, ArchiveBoxIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { findShopDataByUser } from "@/controllers/shop.controller";
import { findProductByShopId, deleteProductById } from "@/controllers/product.controller";
import placeholder from '@/assets/images/login-illustration.png';
import isTokenExpired from '@/service/isTokenExpired';

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageShopPage() {
    const navigate = useNavigate();
    
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchShopAndProducts = async () => {
            try {
                // 1. Ambil token dari localStorage
                const token = localStorage.getItem('token');
                
                if (!token) {
                    if (isMounted) {
                        setLoading(false);
                        navigate('/login');
                    }
                    return;
                }

                // 2. Decode token untuk mendapatkan ID User
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                if (!userId) {
                    throw new Error("ID User tidak valid di dalam token.");
                }

                setLoading(true);
                setError(null);

                // 3. Fetch Data Toko menggunakan userId
                const shopResponse = await findShopDataByUser(userId);
                console.log("🔍 Cek Response Toko:", shopResponse); 

                // Ekstrak data toko dengan aman
                let extractedShop = null;
                if (shopResponse?.id) {
                    extractedShop = shopResponse;
                } else if (shopResponse?.data?.id) {
                    extractedShop = shopResponse.data;
                } else if (Array.isArray(shopResponse) && shopResponse.length > 0) {
                    extractedShop = shopResponse[0];
                } else if (Array.isArray(shopResponse?.data) && shopResponse.data.length > 0) {
                    extractedShop = shopResponse.data[0];
                }

                if (isMounted) {
                    if (extractedShop && extractedShop.id) {
                        setShop(extractedShop);

                        // 4. Fetch Data Produk
                        const productRes = await findProductByShopId(extractedShop.id);
                        console.log("🔍 Cek Response Produk:", productRes); 

                        // Ekstrak data produk
                        let extractedProducts = [];
                        if (Array.isArray(productRes?.data?.data)) {
                            extractedProducts = productRes.data.data;
                        } else if (Array.isArray(productRes?.data)) {
                            extractedProducts = productRes.data;
                        } else if (Array.isArray(productRes)) {
                            extractedProducts = productRes;
                        }
                        
                        setProducts(extractedProducts);
                    } else {
                        setShop(null); // User belum punya toko
                    }
                }
            } catch (err) {
                console.error("Gagal memuat data:", err);
                if (isMounted) setError("Terjadi kesalahan saat memuat data toko.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchShopAndProducts();

        return () => { isMounted = false; };
    }, [navigate]);

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            try {
                await deleteProductById(id);
                setProducts(products.filter(p => p.id !== id));
                alert("Produk berhasil dihapus");
            } catch (error) {
                console.error(error);
                alert("Gagal menghapus produk. Silakan coba lagi.");
            }
        }
    };

    // --- RENDER UI STATE ---

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-main-2"></div>
                <span className="ml-3 text-zinc-600 font-medium">Memuat data toko...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-start gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 shrink-0" />
                <div>
                    <h3 className="font-semibold">Peringatan</h3>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-stone-200 rounded-lg text-center shadow-sm">
                <ArchiveBoxIcon className="w-16 h-16 text-zinc-300 mb-4" />
                <h2 className="text-xl font-bold text-zinc-800 mb-2">Data Toko Tidak Ditemukan</h2>
                <p className="text-zinc-500 mb-6 text-sm">Sistem tidak dapat menemukan data kemitraan yang terhubung dengan akun ini.</p>
                <Link 
                    to="/partnership" 
                    className="bg-green-main-2 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                >
                    Daftar Mitra Sekarang
                </Link>
            </div>
        );
    }

    // Tampilan Utama
    return (
        <div className="space-y-8 pt-16 pb-10">
            {/* Header Profil Toko dengan Banner dan PFP */}
            <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
                {/* Banner Toko */}
                <div className="h-32 sm:h-48 w-full bg-stone-300">
                    <img 
                        src={`${API_URL}/api/images/users/shop/banner/${shop?.fileBanner}` || placeholder} 
                        alt="Banner Toko" 
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>

                {/* Info Toko & PFP */}
                <div className="px-6 pb-6 pt-4 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="flex items-end gap-4 sm:gap-6">
                        {/* Profile Picture Toko (PFP) - Diangkat sedikit agar menyentuh banner */}
                        <div className="relative -mt-16 sm:-mt-20 shrink-0">
                            <img 
                                src={`${API_URL}/api/images/users/shop/pfp/${shop?.filePfp}` || placeholder} 
                                alt="Foto Toko" 
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-sm bg-white"
                            />
                        </div>
                        
                        {/* Nama & Deskripsi Toko */}
                        <div className="pb-2">
                            <h1 className="text-2xl font-bold text-zinc-800">{shop?.nama_toko || shop?.nama || "Toko Tanpa Nama"}</h1>
                            <p className="text-zinc-500 text-sm mt-1 hidden sm:block max-w-xl">{shop?.deskripsi_toko || shop?.deskripsi || "Belum ada deskripsi toko."}</p>
                        </div>
                    </div>

                    {/* Badge Status */}
                    <div className="pb-2 sm:pb-4 self-start sm:self-auto">
                        <span className="inline-flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200">
                            Status: Mitra Aktif
                        </span>
                    </div>
                </div>
                {/* Deskripsi untuk mobile (muncul di bawah jika layar kecil) */}
                <p className="text-zinc-500 text-sm px-6 pb-6 sm:hidden">{shop?.deskripsi_toko || shop?.deskripsi || "Belum ada deskripsi toko."}</p>
            </div>

            {/* Bagian Manajemen Produk */}
            <section>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-zinc-800">
                        <ArchiveBoxIcon className="w-5 h-5" /> Kelola Produk
                    </h3>
                    <Link 
                        to="/sell" 
                        className="bg-green-main-2 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <PlusIcon className="w-4 h-4" /> Tambah Produk
                    </Link>
                </div>

                <div className="bg-white border border-stone-200 rounded-lg overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-5 py-3 text-sm font-semibold text-zinc-600">Nama Produk</th>
                                <th className="px-5 py-3 text-sm font-semibold text-zinc-600">Kategori</th>
                                <th className="px-5 py-3 text-sm font-semibold text-zinc-600">Harga</th>
                                <th className="px-5 py-3 text-sm font-semibold text-zinc-600 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map((product) => (
                                <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-zinc-800 text-sm">{product.nama}</div>
                                    </td>
                                    <td className="px-5 py-4 text-zinc-500 text-sm">
                                        {product.kategori || "-"}
                                    </td>
                                    <td className="px-5 py-4 text-zinc-800 font-semibold text-sm">
                                        Rp {product.harga?.toLocaleString() || "0"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-center gap-2">
                                            <a 
                                                href={`/product/${product.id}`}
                                                className="p-1.5 text-black hover:bg-black/10 rounded-md transition-colors border border-transparent hover:border-black/40"
                                                title="Details"
                                            >
                                                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                                            </a>
                                            <button 
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-200"
                                                title="Hapus Produk"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-5 py-8 text-center text-zinc-400 text-sm">
                                        Belum ada produk yang dijual. Silakan tambah produk baru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Bagian Daftar Transaksi */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-zinc-800">
                        <ShoppingCartIcon className="w-5 h-5" /> Pesanan Masuk
                    </h3>
                </div>
                
                <div className="bg-white border border-stone-200 rounded-lg p-10 text-center shadow-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="bg-stone-50 p-4 rounded-full">
                            <ShoppingCartIcon className="w-10 h-10 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-zinc-600 font-medium">Belum ada transaksi</p>
                            <p className="text-sm text-zinc-400 mt-1">Daftar pesanan dari pembeli akan otomatis muncul di sini.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}