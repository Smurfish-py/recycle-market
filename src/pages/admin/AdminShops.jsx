import { useEffect, useState } from "react";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"; 

export default function AdminShops() {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const fetchShops = async () => {
        try {
            setIsLoading(true);
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
        <section className="w-full flex flex-col gap-4 h-full pb-10 font-inter">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-stone-800">Daftar Toko / Mitra</h2>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">Kelola status toko mitra dan persetujuan berjualan.</p>
                </div>
                
                <div className="relative w-full md:w-auto">
                    <div className="bg-emerald-100 border border-emerald-200 text-emerald-600 px-4 py-2.5 rounded-md font-semibold text-sm flex items-center justify-center md:justify-start gap-2 w-full">
                        <BuildingStorefrontIcon className="w-5 h-5" />
                        {shops.length} Total Toko
                    </div>
                </div>
            </div>

            <div className="bg-transparent md:bg-white md:rounded-md md:border md:border-zinc-200 w-full">
                {isLoading ? (
                    <div className="flex justify-center items-center py-16 bg-white rounded-md border border-zinc-200">
                        <div className="flex items-center gap-3 text-zinc-500">
                            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-md animate-spin"></div>
                            <span className="font-medium animate-pulse">Memuat data toko...</span>
                        </div>
                    </div>
                ) : shops.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-md border border-zinc-200 text-zinc-500 italic">
                        Belum ada toko yang terdaftar saat ini.
                    </div>
                ) : (
                    <>
                        {/* Tampilan Mobile: Menggunakan Card */}
                        <div className="md:hidden flex flex-col gap-4">
                            {shops.map((shop) => (
                                <div key={shop.id} className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                                    <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                                        <div>
                                            <h3 className="font-bold text-stone-800 text-lg">{shop.nama}</h3>
                                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">ID: {shop.id}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                                            shop.shopStatus === 'APPROVE' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-orange-100 text-orange-600'
                                        }`}>
                                            {shop.shopStatus}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 text-sm text-zinc-600 mb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] text-zinc-400 uppercase font-semibold">Pemilik Toko</span>
                                            <span className="font-medium text-stone-800">{shop.user?.fullname || "Tidak diketahui"}</span>
                                            <span className="text-xs text-zinc-500">{shop.user?.email}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] text-zinc-400 uppercase font-semibold">Deskripsi</span>
                                            <p className="text-xs text-zinc-600 line-clamp-2 italic" title={shop.deskripsi}>
                                                "{shop.deskripsi || "Tidak ada deskripsi"}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <Link 
                                            to={`/shop/${shop.id}/details`} 
                                            className="bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 py-2 rounded-md font-semibold text-xs transition-colors text-center"
                                        >
                                            Lihat Detail
                                        </Link>
                                        <button 
                                            onClick={() => handleStatusChange(shop.id, shop.shopStatus)}
                                            className={`py-2 rounded-md font-semibold text-xs transition-colors border text-center ${
                                                shop.shopStatus === 'APPROVE' 
                                                    ? 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50' 
                                                    : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                                            }`}
                                        >
                                            {shop.shopStatus === 'APPROVE' ? 'Jadikan Pending' : 'Approve Toko'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto rounded-md">
                            <table className="w-full text-sm text-left text-gray-500 border-collapse">
                                <thead className="font-poppins text-xs text-gray-700 uppercase bg-gray-50 border-b border-zinc-200 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 whitespace-nowrap text-center">No</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Nama Toko</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Pemilik (User)</th>
                                        <th className="px-6 py-4">Deskripsi</th>
                                        <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                                        <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shops.map((shop, index) => (
                                        <tr key={shop.id} className="bg-white border-b border-stone-200 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 text-center">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-semibold text-stone-800">{shop.nama}</div>
                                                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">ID: {shop.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-stone-700 font-medium">{shop.user?.fullname || "Tidak diketahui"}</div>
                                                <div className="text-[10px] text-zinc-500">{shop.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-600">
                                                <div className="line-clamp-2 max-w-xs" title={shop.deskripsi}>
                                                    {shop.deskripsi || <span className="italic text-zinc-400">-</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                    shop.shopStatus === 'APPROVE' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                    {shop.shopStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
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
                                                                : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
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
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}