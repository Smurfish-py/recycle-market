import { useEffect, useState } from "react";
import { InboxArrowDownIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function AdminRequests() {
    const [requests, setRequests] = useState([]);
    
    // Simulasi data fetch dari Backend API (Tabel Permintaan)
    useEffect(() => {
        // Nanti diganti dengan fetch API yang mengambil data dari tabel 'Permintaan'
        // yang statusnya = 'PENDING' beserta relasi user-nya (include: { user: true })
        const dummyData = [
            {
                id: 1,
                idUser: 12,
                namaUser: "Budi Santoso",
                tipe: "BUKA_TOKO",
                idReferensi: 5,
                tanggal: "2026-03-15T09:00:00Z"
            },
            {
                id: 2,
                idUser: 25,
                namaUser: "Toko Eco Green",
                tipe: "JUAL_PRODUK",
                idReferensi: 102,
                tanggal: "2026-03-15T10:30:00Z"
            }
        ];
        setRequests(dummyData);
    }, []);

    const handleAction = async (idRequest, action) => {
        const confirmMessage = action === 'DISETUJUI' ? 'setujui' : 'tolak';
        if (!window.confirm(`Yakin ingin men${confirmMessage} permintaan ini?`)) return;

        // TODO: Panggil API controller untuk update status:
        // 1. Update status Permintaan menjadi DISETUJUI / DITOLAK
        // 2. Jika DISETUJUI: Update ShopRequest di tabel Toko (jika BUKA_TOKO) 
        //    atau StatusProduk di tabel Produk (jika JUAL_PRODUK).
        
        alert(`Permintaan berhasil di-${confirmMessage}!`);
        // Refresh daftar request
        setRequests(prev => prev.filter(req => req.id !== idRequest));
    };

    return (
        <div className="font-inter">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-stone-700">Kotak Masuk Permintaan</h2>
                    <p className="text-sm text-zinc-500">Tinjau pengajuan buka toko dan produk baru dari pengguna.</p>
                </div>
                <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2">
                    <InboxArrowDownIcon className="size-5" />
                    {requests.length} Menunggu Tinjauan
                </div>
            </div>

            <div className="card border border-zinc-300 bg-white flex flex-col p-6 col-span-1 lg:col-span-3">
                <div className="overflow-x-auto rounded-md">
                    <table className="
                        w-full border border-zinc-300 border-collapse
                        [&_tr]:h-14 [&_tr]:border [&_tr]:border-zinc-300
                        [&_th]:px-4 [&_th]:border [&_th]:border-zinc-300
                        [&_td]:px-4 [&_td]:border [&_td]:border-zinc-300 
                    ">
                        <thead className="bg-zinc-200 text-left font-poppins text-sm uppercase text-stone-600">
                            <tr>
                                <th className="text-center w-12">No</th>
                                <th>Pengaju</th>
                                <th>Tipe Permintaan</th>
                                <th>Tanggal</th>
                                <th className="text-center w-40">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {requests.map((req, index) => (
                                <tr key={req.id} className="hover:bg-green-accent/20 transition-colors">
                                    <td className="text-center text-zinc-500">{index + 1}</td>
                                    <td className="font-semibold text-stone-700">
                                        {req.namaUser}
                                        <p className="text-[10px] text-zinc-400 font-normal">ID User: {req.idUser}</p>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-sm text-xs font-bold ${
                                            req.tipe === 'BUKA_TOKO' 
                                                ? 'bg-sky-100 text-sky-600' 
                                                : 'bg-indigo-100 text-indigo-600'
                                        }`}>
                                            {req.tipe.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="text-zinc-500">
                                        {new Date(req.tanggal).toLocaleString('id-ID')}
                                    </td>
                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleAction(req.id, 'DISETUJUI')}
                                                title="Setujui" 
                                                className="bg-green-main-2 text-white p-1.5 rounded-md hover:scale-105 transition shadow-sm"
                                            >
                                                <CheckCircleIcon className="size-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req.id, 'DITOLAK')}
                                                title="Tolak" 
                                                className="bg-rose-500 text-white p-1.5 rounded-md hover:scale-105 transition shadow-sm"
                                            >
                                                <XCircleIcon className="size-5" />
                                            </button>
                                            <button 
                                                title="Lihat Detail (Preview)" 
                                                className="bg-zinc-100 text-zinc-600 border border-zinc-300 px-3 py-1.5 rounded-md hover:bg-zinc-200 transition text-xs font-semibold"
                                            >
                                                Detail
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {requests.length === 0 && (
                        <div className="text-center py-16 border-x border-b border-zinc-300 text-zinc-400 italic bg-zinc-50/50">
                            Tidak ada permintaan baru saat ini. Anda sudah menyelesaikan semuanya!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}