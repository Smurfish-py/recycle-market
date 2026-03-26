import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon, ArrowTopRightOnSquareIcon, ShoppingCartIcon, ArchiveBoxIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { findShopDataByUser } from "@/controllers/shop.controller";
import { findProductByShopId, deleteProductById } from "@/controllers/product.controller";
import placeholder from '@/assets/images/login-illustration.png';

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageShopPage() {
    const navigate = useNavigate();

    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchShopAndProducts = async () => {
            try {

                const token = localStorage.getItem('token');
                
                if (!token) {
                    if (isMounted) {
                        setLoading(false);
                        navigate('/login');
                    }
                    return;
                }

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                if (!userId) {
                    throw new Error("ID User tidak valid di dalam token.");
                }

                setLoading(true);
                setError(null);

                const shopResponse = await findShopDataByUser(userId);

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

                        const productRes = await findProductByShopId(extractedShop.id);

                        let extractedProducts = [];
                        if (Array.isArray(productRes?.data?.data)) {
                            extractedProducts = productRes.data.data;
                        } else if (Array.isArray(productRes?.data)) {
                            extractedProducts = productRes.data;
                        } else if (Array.isArray(productRes)) {
                            extractedProducts = productRes;
                        }
                        
                        setProducts(extractedProducts);
                        fetchShopOrders(userId);

                    } else {
                        setShop(null); 
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

    const fetchShopOrders = async (idPenjual) => {
        setLoadingOrders(true);
        try {
            const response = await fetch(`${API_URL}/api/transaksi/all/admin`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const allData = await response.json();
            
            // Filter hanya pesanan di mana idPenjual cocok dengan userId pemilik toko
            const myOrders = allData.filter(order => order.idPenjual === idPenjual);
            setOrders(myOrders);

        } catch (error) {
            console.error("Gagal memuat pesanan:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini? semua hal yang berkaitan dengan produk akan hilang termasuk data transaksi dan markah yang disimpan pengguna.")) {
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

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };


    // --- RENDER UI STATE ---

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10 min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-main-2"></div>
                <span className="ml-3 text-zinc-600 font-medium font-poppins">Memuat dasbor toko...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 m-8 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-start gap-3 font-inter">
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
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-stone-200 rounded-lg text-center m-8 font-inter">
                <ArchiveBoxIcon className="w-16 h-16 text-zinc-300 mb-4" />
                <h2 className="text-xl font-bold text-zinc-800 mb-2">Data Toko Tidak Ditemukan</h2>
                <p className="text-zinc-500 mb-6 text-sm">Sistem tidak dapat menemukan data kemitraan yang terhubung dengan akun ini.</p>
                <Link 
                    to="/partnership" 
                    className="bg-green-main-2 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
                >
                    Daftar Mitra Sekarang
                </Link>
            </div>
        );
    }

    // --- TAMPILAN UTAMA MANAGE SHOP ---
    return (
        <div className="space-y-8 pt-16 pb-10 px-4 md:px-12 font-inter max-w-7xl mx-auto">
            
            {/* Header Profil Toko dengan Banner dan PFP */}
            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden ">
                {/* Banner Toko */}
                <div className="h-32 sm:h-48 w-full bg-stone-300">
                    <img 
                        src={shop?.fileBanner ? `${API_URL}/api/images/users/shop/banner/${shop?.fileBanner}` : placeholder} 
                        alt="Banner Toko" 
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>

                {/* Info Toko & PFP */}
                <div className="px-6 pb-6 pt-4 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="flex items-end gap-4 sm:gap-6">
                        {/* Profile Picture Toko (PFP) */}
                        <div className="relative -mt-16 sm:-mt-20 shrink-0">
                            <img 
                                src={shop?.filePfp ? `${API_URL}/api/images/users/shop/pfp/${shop?.filePfp}` : placeholder} 
                                alt="Foto Toko" 
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover bg-white "
                            />
                        </div>
                        <div className="pb-2">
                            <h1 className="text-2xl font-bold text-zinc-800 font-poppins tracking-tight">
                                {shop?.nama_toko || shop?.nama || "Toko Tanpa Nama"}
                            </h1>
                            <p className="text-zinc-500 text-sm mt-1 hidden sm:block max-w-xl">
                                {shop?.deskripsi_toko || shop?.deskripsi || "Belum ada deskripsi toko."}
                            </p>
                        </div>
                    </div>

                    {/* Badge Status */}
                    <div className="pb-2 sm:pb-4 self-start sm:self-auto">
                        <span className={`inline-flex items-center px-3 py-1.5 ${shop?.shopStatus !== "APPROVE" ? "border-amber-200 bg-amber-50 text-amber-500" : "bg-green-50 text-green-main-2 border-green-200"} rounded text-xs font-bold border tracking-wide uppercase`}>
                            {shop?.shopStatus !== "APPROVE" ? "Belum Terverifikasi" : "Partner Terverifikasi"}
                        </span>
                    </div>
                </div>
                {/* Deskripsi untuk mobile */}
                <p className="text-zinc-500 text-sm px-6 pb-6 sm:hidden">
                    {shop?.deskripsi_toko || shop?.deskripsi || "Belum ada deskripsi toko."}
                </p>
            </div>

            {/* Bagian Manajemen Produk */}
            <section>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-800 font-poppins">
                        <ArchiveBoxIcon className="w-6 h-6 text-green-main-2" /> Kelola Produk
                    </h3>
                    <Link 
                        to="/sell" 
                        className="bg-green-main-2 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-sm font-semibold "
                    >
                        <PlusIcon className="w-5 h-5 stroke-2" /> Tambah Produk
                    </Link>
                </div>

                <div className="bg-white border border-stone-200 rounded-lg overflow-x-auto ">
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
                                        <div className="font-semibold text-zinc-800 text-sm">{product.nama}</div>
                                    </td>
                                    <td className="px-5 py-4 text-zinc-500 text-sm">
                                        {product.kategori || "-"}
                                    </td>
                                    <td className="px-5 py-4 text-green-700 font-semibold text-sm">
                                        {formatRupiah(product.harga)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-center gap-2">
                                            <a 
                                                href={`/product/${product.id}`}
                                                className="p-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors border border-transparent"
                                                title="Lihat Detail Produk"
                                            >
                                                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                                            </a>
                                            <button 
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-transparent"
                                                title="Hapus Produk"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-5 py-8 text-center text-zinc-400 text-sm italic bg-stone-50/50">
                                        Belum ada produk yang dijual. Silakan tambah produk baru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Bagian Pesanan Masuk */}
            <section className="pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-800 font-poppins">
                        <ShoppingCartIcon className="w-6 h-6 text-green-main-2" /> Pesanan Masuk
                    </h3>
                </div>
                
                <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-6 ">
                    {loadingOrders ? (
                        <div className="text-center py-10 text-zinc-500 animate-pulse">Memeriksa pesanan baru...</div>
                    ) : orders.length > 0 ? (
                        <>
                            {/* Tampilan Mobile (Card) */}
                            <div className="md:hidden flex flex-col gap-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-zinc-200 rounded-lg p-4 bg-zinc-50">
                                        <div className="flex justify-between items-start mb-3 border-b border-zinc-200 pb-3">
                                            <div>
                                                <span className="font-bold text-stone-700 text-sm">Pesanan #{order.id}</span>
                                                <p className="text-[10px] text-zinc-500 mt-0.5">
                                                    {new Date(order.tanggal).toLocaleDateString('id-ID', {
                                                        day: '2-digit', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                                                order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                order.status === 'FAILED' ? 'bg-rose-100 text-rose-700' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 mb-3">
                                            <div>
                                                <p className="text-zinc-400">ID Pembeli</p>
                                                <p className="font-semibold text-stone-700">User #{order.idUser}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-400">Metode</p>
                                                {/* TAMBAHAN BARTER DI MOBILE */}
                                                <span className={`border px-2 py-0.5 rounded-sm text-[10px] font-bold mt-1 inline-block uppercase tracking-wide ${
                                                    order.metode === 'LANGSUNG' ? 'border-green-300 text-green-700 bg-green-50' :
                                                    order.metode === 'BARTER' ? 'border-purple-300 text-purple-700 bg-purple-50' :
                                                    'border-sky-300 text-sky-700 bg-sky-50'
                                                }`}>
                                                    {order.metode === 'LANGSUNG' ? 'COD' : order.metode}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center py-3 rounded  mt-2 ">
                                            <span className="text-xs text-zinc-500 font-medium">Total Pembayaran</span>
                                            <span className="font-bold text-green-700 text-sm">
                                                {formatRupiah(order.harga * order.kuantitas)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="hidden md:block overflow-x-auto rounded-md">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-stone-50 border-b border-stone-200">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 w-16 text-center">ID</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600">Tanggal</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600">Pembeli</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 text-center">Metode</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 text-right">Total Tagihan</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                                <td className="px-4 py-3 text-center text-zinc-500 font-mono">#{order.id}</td>
                                                <td className="px-4 py-3 text-zinc-600">
                                                    {new Date(order.tanggal).toLocaleDateString('id-ID', {
                                                        day: '2-digit', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-stone-700">User #{order.idUser}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {/* TAMBAHAN BARTER DI DESKTOP */}
                                                    <span className={`border px-2 py-1 rounded-sm text-[10px] font-bold tracking-wide uppercase ${
                                                        order.metode === 'LANGSUNG' ? 'border-green-300 text-green-700 bg-green-50' :
                                                        order.metode === 'BARTER' ? 'border-purple-300 text-purple-700 bg-purple-50' :
                                                        'border-sky-300 text-sky-700 bg-sky-50'
                                                    }`}>
                                                        {order.metode === 'LANGSUNG' ? 'COD' : order.metode}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-green-700 text-right">
                                                    {formatRupiah(order.harga * order.kuantitas)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                                                        order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'FAILED' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-orange-100 text-orange-600'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 py-10">
                            <div className="bg-stone-50 p-4 rounded-full border border-stone-100">
                                <ShoppingCartIcon className="w-10 h-10 text-zinc-300" />
                            </div>
                            <div className="text-center">
                                <p className="text-zinc-600 font-semibold text-lg">Belum ada pesanan</p>
                                <p className="text-sm text-zinc-400 mt-1 max-w-sm mx-auto">Daftar pesanan dari pembeli akan otomatis muncul di sini ketika ada transaksi masuk.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}