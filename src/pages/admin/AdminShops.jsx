import { useEffect, useState } from "react";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"; // Tambahkan import ini

export default function AdminShops() {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const fetchShops = async () => {
        try {
            const response = await fetch(`${API_URL}/api/toko/all/admin`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setShops(data);
        } catch (error) {
            console.error("Gagal mengambil data toko:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleStatusChange = async (idToko, currentStatus) => {
        const newStatus = currentStatus === 'APPROVE' ? 'PENDING' : 'APPROVE';
        const confirmMessage = newStatus === 'APPROVE' ? 'menyetujui (Approve)' : 'menangguhkan (Pending)';

        if (!window.confirm(`Yakin ingin ${confirmMessage} toko ini?`)) return;

        try {
            const response = await fetch(`${API_URL}/api/toko/${idToko}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert(`Status toko berhasil diubah menjadi ${newStatus}!`);
                setShops(prevShops => 
                    prevShops.map(shop => 
                        shop.id === idToko ? { ...shop, shopStatus: newStatus } : shop
                    )
                );
            } else {
                const errorData = await response.json();
                alert(`Gagal mengubah status: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Terjadi kesalahan jaringan:", error);
            alert("Terjadi kesalahan jaringan, gagal mengubah status.");
        }
    };

    return (
        <div className="font-inter">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-stone-700">Daftar Toko / Mitra</h2>
                    <p className="text-sm text-zinc-500">Kelola status toko mitra dan persetujuan berjualan.</p>
                </div>
                <div className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2">
                    <BuildingStorefrontIcon className="size-5" />
                    {shops.length} Total Toko
                </div>
            </div>

            <div className="card border border-zinc-300 bg-white flex flex-col p-6 col-span-1 lg:col-span-3">
                <div className="overflow-x-auto rounded-md">
                    {isLoading ? (
                        <div className="text-center py-10 text-zinc-500">Memuat data toko...</div>
                    ) : (
                        <table className="
                            w-full border border-zinc-300 border-collapse
                            [&_tr]:h-10 [&_tr]:border [&_tr]:border-zinc-300
                            [&_th]:px-4 [&_th]:border [&_th]:border-zinc-300
                            [&_td]:px-4 [&_td]:border [&_td]:border-zinc-300 
                        ">
                            <thead className="bg-zinc-200 text-left font-poppins text-sm uppercase text-stone-600">
                                <tr>
                                    <th className="text-center w-12">No</th>
                                    <th>Nama Toko</th>
                                    <th>Pemilik (User)</th>
                                    <th>Deskripsi</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {shops.map((shop, index) => (
                                    <tr key={shop.id} className="hover:bg-green-accent/20 transition-colors">
                                        <td className="text-center text-zinc-500">{index + 1}</td>
                                        <td className="font-semibold text-stone-700">{shop.nama}</td>
                                        <td>
                                            <div className="text-stone-700 font-medium">{shop.user?.fullname}</div>
                                            <div className="text-[10px] text-zinc-500">{shop.user?.email}</div>
                                        </td>
                                        <td className="text-zinc-600 truncate max-w-xs" title={shop.deskripsi}>
                                            {shop.deskripsi}
                                        </td>
                                        <td className="text-center">
                                            <span className={`px-2 py-1 rounded-sm text-xs font-bold ${
                                                shop.shopStatus === 'APPROVE' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-orange-100 text-orange-600'
                                            }`}>
                                                {shop.shopStatus}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link 
                                                    to={`/shop/${shop.id}/details`} 
                                                    className="px-3 py-1.5 rounded-md font-semibold text-xs transition-colors border bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100"
                                                >
                                                    Detail
                                                </Link>
                                                <button 
                                                    onClick={() => handleStatusChange(shop.id, shop.shopStatus)}
                                                    className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors border ${
                                                        shop.shopStatus === 'APPROVE' 
                                                            ? 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50' 
                                                            : 'bg-green-main-2 text-white border-green-700 hover:bg-green-700'
                                                    }`}
                                                >
                                                    {shop.shopStatus === 'APPROVE' ? 'Jadikan Pending' : 'Approve Toko'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                    {!isLoading && shops.length === 0 && (
                        <div className="text-center py-16 border-x border-b border-zinc-300 text-zinc-400 italic bg-zinc-50/50">
                            Belum ada toko yang terdaftar.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}