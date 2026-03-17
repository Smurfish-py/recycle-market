import { useEffect, useState } from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/transaksi/all/admin`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error("Gagal mengambil data pesanan:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const formatDateTime = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return d.toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="font-inter">
            {/* Header: Dibuat stack (atas-bawah) di HP, sejajar di layar besar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-stone-700">Log Pesanan (Transaksi)</h2>
                    <p className="text-xs sm:text-sm text-zinc-500">Pantau semua riwayat transaksi yang terjadi di sistem.</p>
                </div>
                <div className="bg-sky-100 text-sky-600 px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                    <ClipboardDocumentListIcon className="size-5" />
                    {orders.length} Total Transaksi
                </div>
            </div>

            <div className="card max-w-260 border border-zinc-300 bg-white flex flex-col p-4 sm:p-6 col-span-1 lg:col-span-3 rounded-md">
                
                {isLoading ? (
                    <div className="text-center py-10 text-zinc-500 animate-pulse">Memuat data pesanan...</div>
                ) : (
                    <>
                        {/* 1. TAMPILAN MOBILE (Card Layout) - Tersembunyi di layar medium ke atas */}
                        <div className="md:hidden flex flex-col gap-4">
                            {orders.map((order, index) => (
                                <div key={order.id} className="border border-zinc-200 rounded-md px-3 py-2 bg-zinc-50">
                                    <div className="flex justify-between items-start mb-3 border-b border-zinc-200 pb-3">
                                        <div>
                                            <span className="font-bold text-stone-700 text-sm">Pesanan #{index + 1}</span>
                                            <p className="text-[10px] text-zinc-500 mt-0.5">
                                                {new Date(order.tanggal).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="space-x-2">
                                            <span className="bg-zinc-100 px-2 py-1 border border-stone-300 rounded-sm text-[10px] font-bold text-zinc-600">
                                                {order.metode}
                                            </span>
                                            <span className={`px-2 py-1 rounded-sm text-[10px] font-bold ${
                                                order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                order.status === 'FAILED' ? 'bg-rose-100 text-rose-700' :
                                                'bg-orange-100 text-orange-600 border border-orange-200'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 mb-3">
                                        <div>
                                            <p className="text-zinc-400">Pembeli</p>
                                            <p className="font-semibold text-stone-700">{order.nama}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-400">Email Pembeli</p>
                                            <p className="font-semibold text-stone-700">{order.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-400">Alamat Pembeli</p>
                                            <p className="font-semibold text-stone-700">{order.alamat}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-400">Telepon Pembeli</p>
                                            <p className="font-semibold text-stone-700">{order.noHp}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-400">Penjual</p>
                                            <p className="font-semibold text-stone-700">Toko #{order.idPenjual}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-400">Kuantitas</p>
                                            <p className="font-semibold text-stone-700">{order.kuantitas}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-400">Tanggal</p>
                                            <p className="font-semibold text-stone-700">{formatDateTime(order?.tanggal)}</p>
                                        </div>
                                    </div>
                                    <hr className="text-zinc-200" />
                                    <div className="flex justify-between items-center mt-2 text-sm font-semibold text-zinc-500">
                                        <p>Jumlah harga</p>
                                        {console.log(order)}
                                        <span className="font-bold text-green-700 text-sm">
                                            {formatRupiah(order.harga * order.kuantitas)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. TAMPILAN DESKTOP/TABLET (Table Layout) - Tersembunyi di layar kecil */}
                        <div className="hidden md:block overflow-x-auto rounded-md">
                            <table className="
                                w-full border border-zinc-300 border-collapse
                                [&_tr]:h-12 [&_tr]:border [&_tr]:border-zinc-300
                                [&_th]:px-4 [&_th]:py-2 [&_th]:border [&_th]:border-zinc-300 [&_th]:whitespace-nowrap
                                [&_td]:px-4 [&_td]:py-2 [&_td]:border [&_td]:border-zinc-300 [&_td]:whitespace-nowrap
                            ">
                                <thead className="bg-zinc-200 text-left font-poppins text-sm uppercase text-stone-600 tracking-wider">
                                    <tr>
                                        <th className="text-center w-12">No</th>
                                        <th>Tanggal</th>
                                        <th>Pembeli</th>
                                        <th>Email Pembeli</th>
                                        <th>Alamat Pembeli</th>
                                        <th>Telepon Pembeli</th>
                                        <th>ID Penjual</th>
                                        <th>Metode</th>
                                        <th>Total Tagihan</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {orders.map((order, index) => (
                                        <tr key={order.id} className="hover:bg-green-accent/20 transition-colors">
                                            <td className="text-center text-zinc-500 font-mono">{index + 1}</td>
                                            <td className="text-zinc-600">
                                                {new Date(order.tanggal).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'long', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="font-semibold text-stone-700">{order.nama}</td>
                                            <td className="font-semibold text-stone-700">{order.email}</td>
                                            <td className="font-semibold text-stone-700">{order.alamat}</td>
                                            <td className="font-semibold text-stone-700">{order.noHp}</td>
                                            <td className="font-semibold text-stone-700">Toko #{order.idPenjual}</td>
                                            <td>
                                                <span className="bg-zinc-100 border border-zinc-300 px-2 py-1 rounded-sm text-xs font-bold text-zinc-600">
                                                    {order.metode}
                                                </span>
                                            </td>
                                            <td className="font-semibold text-green-700">
                                                {formatRupiah(order.harga * order.kuantitas)}
                                            </td>
                                            <td className="text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
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
                )}
                
                {/* Empty State */}
                {!isLoading && orders.length === 0 && (
                    <div className="text-center py-16 border-x border-b border-zinc-300 text-zinc-400 italic bg-zinc-50/50 rounded-b-md">
                        Belum ada riwayat transaksi di aplikasi.
                    </div>
                )}
            </div>
        </div>
    );
}