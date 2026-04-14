import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBagIcon, CalendarDaysIcon, BanknotesIcon, PhoneIcon, TruckIcon } from "@heroicons/react/24/outline";
import { getUserTransactionHistory } from "@/controllers/transaction.controller";

export default function MyOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                setLoading(true);
                const historyData = await getUserTransactionHistory(userId);
                
                if (isMounted) {
                    setOrders(Array.isArray(historyData) ? historyData : []);
                }
            } catch (err) {
                if (isMounted) setError("Gagal memuat riwayat pesanan Anda.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchOrders();

        return () => { isMounted = false; };
    }, [navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Helper untuk mengubah format teks status pengiriman
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

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-main-2"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-16 bg-stone-50 py-10 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
                    <ShoppingBagIcon className="w-8 h-8 text-green-700" />
                    <h1 className="text-2xl font-bold text-zinc-800">Pesanan Anda</h1>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                {(!orders || orders.length === 0) && !error ? (
                    <div className="bg-white p-12 text-center rounded-xl border border-stone-200 flex flex-col items-center">
                        <ShoppingBagIcon className="w-16 h-16 text-zinc-300 mb-4" />
                        <h2 className="text-xl font-semibold text-zinc-700">Belum Ada Transaksi</h2>
                        <p className="text-zinc-500 mt-2 mb-6">Anda belum pernah melakukan pembelian produk apapun.</p>
                        <Link to="/" className="bg-green-main-2 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors font-medium">
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders?.map((order) => (
                            <div key={order.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-stone-100 pb-4 mb-4">
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                                        <CalendarDaysIcon className="w-4 h-4" />
                                        <span>{formatDate(order.tanggal)}</span>
                                        <span className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-bold ml-2 ${
                                            order.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'FAILED' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                            {order.status === 'PAID' ? 'Berhasil' : order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-zinc-600 flex flex-col md:items-end gap-1.5">
                                        <div className="flex items-center gap-1">
                                            <BanknotesIcon className="w-4 h-4" />
                                            Metode: <span className="text-zinc-800 font-bold uppercase tracking-wide text-[11px]">{order.metode === 'LANGSUNG' ? 'COD' : order.metode}</span>
                                        </div>
                                        {/* Status Pengiriman */}
                                        <div className="flex items-center gap-1">
                                            <TruckIcon className="w-4 h-4" />
                                            Pengiriman: <span className="text-sky-600 font-bold uppercase text-[11px] tracking-wide">
                                                {order.metode === 'BARTER' ? '-' : formatShippingText(order.statusPengiriman)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-poppins text-lg font-bold text-zinc-800">
                                            {order.produk?.nama || "Produk Tidak Ditemukan / Dihapus"}
                                        </h3>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            Penjual: <span className="font-semibold text-zinc-700">{order.penjual?.toko?.[0]?.nama || order.penjual?.fullname || "Tidak diketahui"}</span>
                                        </p>
                                        {order.keterangan && (
                                            <p className="text-sm text-zinc-500 mt-1 italic border-l-2 border-zinc-200 pl-2">
                                                Catatan: "{order.keterangan}"
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-left sm:text-right sm:p-3 mt-2 sm:mt-0">
                                        <p className="text-xs text-zinc-500 font-medium">Total Harga ({order.kuantitas} Barang)</p>
                                        <p className="text-lg font-bold text-green-700 mt-0.5">
                                            Rp {(order.produk?.harga * order.kuantitas)?.toLocaleString('id-ID') || "0"}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                                    {/* Info Kontak Penjual */}
                                    <div className="flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-start bg-stone-50 px-3 py-2 rounded-md">
                                        <PhoneIcon className="w-4 h-4 text-zinc-500" />
                                        <span className="text-zinc-600 font-medium">Hubungi Toko:</span>
                                        {order.penjual?.noHp ? (
                                            <a 
                                                href={`https://wa.me/${order.penjual.noHp.replace(/^0/, '62')}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-green-600 font-bold hover:underline tracking-wide"
                                            >
                                                {order.penjual.noHp}
                                            </a>
                                        ) : (
                                            <span className="italic text-zinc-400 text-xs">Belum mengatur no. HP</span>
                                        )}
                                    </div>

                                    <Link 
                                        to={`/product/${order.idProduk}`} 
                                        className="text-sm font-semibold text-white bg-green-main-2 hover:bg-green-700 transition-colors px-6 py-2 rounded-md w-full sm:w-auto text-center"
                                    >
                                        Beli Lagi
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}