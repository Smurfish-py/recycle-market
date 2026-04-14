import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon, ArrowTopRightOnSquareIcon, ShoppingCartIcon, ArchiveBoxIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { findShopDataByUser } from "@/controllers/shop.controller";
import { findProductByShopId, deleteProductById } from "@/controllers/product.controller";
import placeholder from '@/assets/images/login-illustration.png';

const API_URL = import.meta.env.VITE_API_URL;

// Urutan status pengiriman untuk validasi tombol
const SHIPPING_STAGES = ['MENUNGGU', 'DIPERSIAPKAN', 'PENGEMASAN', 'PENGANTARAN', 'SAMPAI_TUJUAN'];

export default function ManageShopPage() {
    const navigate = useNavigate();

    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk Modal Pengiriman
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleUpdateShippingStatus = async (orderId, newStatus) => {
        try {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statusPengiriman: newStatus } : o));
            setSelectedOrder(prev => ({ ...prev, statusPengiriman: newStatus }));

            await fetch(`${API_URL}/api/transaksi/${orderId}/shipping`, {
                method: 'PATCH', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({ statusPengiriman: newStatus })
            });
        } catch (error) {
            console.error("Gagal update status pengiriman:", error);
            alert("Terjadi kesalahan saat mengupdate status.");
        }
    };

    const formatShippingText = (status) => {
        switch(status) {
            case 'DIPERSIAPKAN': return 'Dipersiapkan';
            case 'PENGEMASAN': return 'Pengemasan';
            case 'PENGANTARAN': return 'Pengantaran';
            case 'SAMPAI_TUJUAN': return 'Sampai Tujuan';
            case 'MENUNGGU':
            default: return 'Menunggu';
        }
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

    const currentStatusIndex = SHIPPING_STAGES.indexOf(selectedOrder?.statusPengiriman || 'MENUNGGU');

    const shippingSteps = [
        { id: 'DIPERSIAPKAN', title: 'Dipersiapkan', desc: 'Penjual sedang memproses pesanan.', color: 'amber' },
        { id: 'PENGEMASAN', title: 'Pengemasan', desc: 'Pesanan sedang dikemas secara aman.', color: 'blue' },
        { id: 'PENGANTARAN', title: 'Pengantaran', desc: 'Pesanan diserahkan ke kurir.', color: 'purple' },
        { id: 'SAMPAI_TUJUAN', title: 'Sampai Tujuan', desc: 'Berhasil sampai ke pembeli.', color: 'green' }
    ];

    // --- TAMPILAN UTAMA MANAGE SHOP ---
    return (
        <div className="space-y-8 pt-16 pb-10 px-4 md:px-12 font-inter max-w-7xl mx-auto relative">
            
            {/* --- MODAL STATUS PENGIRIMAN --- */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 md:p-8 relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-5 text-zinc-400 hover:text-red-500 font-bold text-xl"
                            title="Tutup Modal"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-6 text-zinc-800 font-poppins border-b pb-3">
                            Status Pengiriman - Pesanan #{selectedOrder.id}
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {shippingSteps.map((step, index) => {
                                const stepStageIndex = index + 1; 
                                const isCompleted = currentStatusIndex >= stepStageIndex;
                                const isNextToClick = currentStatusIndex === stepStageIndex - 1; 
                                
                                return (
                                    <div key={step.id} className={`border rounded-lg p-4 flex flex-col justify-between items-center text-center gap-3 transition-colors ${
                                        isCompleted ? 'border-green-300 bg-green-50/50' : 
                                        isNextToClick ? 'border-zinc-300 bg-white shadow-sm' : 
                                        'border-stone-100 bg-stone-50 opacity-60'
                                    }`}>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 ${
                                                isCompleted ? 'bg-green-100 text-green-600' :
                                                isNextToClick ? `bg-${step.color}-100 text-${step.color}-600` :
                                                'bg-stone-200 text-stone-400'
                                            }`}>
                                                {isCompleted ? '✓' : index + 1}
                                            </div>
                                            <h3 className="font-semibold text-sm text-zinc-800">{step.title}</h3>
                                            <p className="text-xs text-zinc-500 mt-1">{step.desc}</p>
                                        </div>
                                        
                                        <button 
                                            disabled={!isNextToClick}
                                            onClick={() => handleUpdateShippingStatus(selectedOrder.id, step.id)}
                                            className={`mt-2 w-full py-2 rounded text-xs font-bold transition-colors ${
                                                isCompleted ? 'bg-green-100 text-green-700 cursor-not-allowed' :
                                                isNextToClick ? 'bg-green-600 hover:bg-green-700 text-white' :
                                                'bg-stone-200 text-stone-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {isCompleted ? 'Selesai' : isNextToClick ? 'Update Status' : 'Terkunci'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Header Profil Toko */}
            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden ">
                <div className="h-32 sm:h-48 w-full bg-stone-300">
                    <img 
                        src={shop?.fileBanner ? `${API_URL}/api/images/users/shop/banner/${shop?.fileBanner}` : placeholder} 
                        alt="Banner Toko" 
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>

                <div className="px-6 pb-6 pt-4 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="flex items-end gap-4 sm:gap-6">
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

                    <div className="pb-2 sm:pb-4 self-start sm:self-auto">
                        <span className={`inline-flex items-center px-3 py-1.5 ${shop?.shopStatus !== "APPROVE" ? "border-amber-200 bg-amber-50 text-amber-500" : "bg-green-50 text-green-main-2 border-green-200"} rounded text-xs font-bold border tracking-wide uppercase`}>
                            {shop?.shopStatus !== "APPROVE" ? "Belum Terverifikasi" : "Partner Terverifikasi"}
                        </span>
                    </div>
                </div>
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
                            {/* Tampilan Mobile */}
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
                                                <p className="text-zinc-400">Pembeli</p>
                                                <p className="font-semibold text-stone-700">{order.nama}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-400">Metode</p>
                                                <span className={`border px-2 py-0.5 rounded-sm text-[10px] font-bold mt-1 inline-block uppercase tracking-wide ${
                                                    order.metode === 'LANGSUNG' ? 'border-green-300 text-green-700 bg-green-50' :
                                                    order.metode === 'BARTER' ? 'border-purple-300 text-purple-700 bg-purple-50' :
                                                    'border-sky-300 text-sky-700 bg-sky-50'
                                                }`}>
                                                    {order.metode === 'LANGSUNG' ? 'COD' : order.metode}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                                            <span className="text-xs text-zinc-500 font-medium">Progres Pengiriman</span>
                                            <span className="font-bold text-zinc-800 text-[11px] uppercase">
                                                {order.metode === 'BARTER' ? '-' : formatShippingText(order.statusPengiriman)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center py-3 rounded mt-1 border-b border-zinc-200 mb-3">
                                            <span className="text-xs text-zinc-500 font-medium">Total Pembayaran</span>
                                            <span className="font-bold text-green-700 text-sm">
                                                {formatRupiah(order.harga * order.kuantitas)}
                                            </span>
                                        </div>

                                        {/* Aksi Pengiriman untuk Mobile */}
                                        <div className="flex justify-end pt-1">
                                            {order.metode === 'BARTER' ? (
                                                <a 
                                                    href={`https://wa.me/${order.noHp ? order.noHp.replace(/^0/, '62') : ''}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-xs font-bold transition-colors w-full text-center"
                                                >
                                                    Hubungi WhatsApp
                                                </a>
                                            ) : (
                                                <button 
                                                    onClick={() => handleOpenModal(order)}
                                                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-xs font-bold transition-colors w-full text-center"
                                                >
                                                    Update Status
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tampilan Desktop */}
                            <div className="hidden md:block overflow-x-auto rounded-md">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-stone-50 border-b border-stone-200">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 w-16 text-center">ID</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600">Tanggal</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600">Pembeli</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 text-center">Metode</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 text-right">Total Tagihan</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 text-center">Pembayaran</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 text-center">Pengiriman</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-zinc-600 text-center">Aksi</th>
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
                                                <td className="px-4 py-3 font-semibold text-stone-700">{order.nama}</td>
                                                <td className="px-4 py-3 text-center">
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
                                                {/* Status Pengiriman */}
                                                <td className="px-4 py-3 text-center text-xs font-semibold text-zinc-600 uppercase tracking-wide">
                                                    {order.metode === 'BARTER' ? '-' : formatShippingText(order.statusPengiriman)}
                                                </td>
                                                {/* Kolom Aksi Tombol */}
                                                <td className="px-4 py-3 text-center">
                                                    {order.metode === 'BARTER' ? (
                                                        <a 
                                                            href={`https://wa.me/${order.noHp ? order.noHp.replace(/^0/, '62') : ''}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="inline-block bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-[11px] font-bold transition-colors w-full"
                                                        >
                                                            WhatsApp
                                                        </a>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleOpenModal(order)}
                                                            className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded text-[11px] font-bold transition-colors w-full"
                                                        >
                                                            Update Status
                                                        </button>
                                                    )}
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