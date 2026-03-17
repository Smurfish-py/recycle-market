import { useEffect, useState } from "react";
import { InboxArrowDownIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function AdminRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Sesuaikan Base URL ini dengan URL backend Anda (misal: localhost:3000)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    // Mengambil data dari Backend API (Tabel Permintaan)
    const fetchRequests = async () => {
        try {
            const response = await fetch(`${API_URL}/api/requests/pending`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Opsional jika endpoint di-protect
                }
            });
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error("Gagal mengambil data permintaan:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (idRequest, action) => {
        const confirmMessage = action === 'DISETUJUI' ? 'setujui' : 'tolak';
        if (!window.confirm(`Yakin ingin men${confirmMessage} permintaan ini?`)) return;

        try {
            // Panggil API controller backend untuk update status
            const response = await fetch(`${API_URL}/api/requests/${idRequest}/process`, {
                method: 'PUT', // Pastikan backend Anda menggunakan PUT/POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ action }) // Mengirim 'DISETUJUI' atau 'DITOLAK'
            });

            console.log(response)

            if (response.ok) {
                alert(`Permintaan berhasil di-${confirmMessage}!`);
                // Hapus data dari UI tanpa perlu refresh halaman
                setRequests(prev => prev.filter(req => req.id !== idRequest));
            } else {
                const errorData = await response.json();
                alert(`Gagal memproses permintaan: ${errorData.pesan}`);
            }
        } catch (error) {
            console.error("Terjadi kesalahan jaringan:", error);
            alert("Terjadi kesalahan jaringan, gagal memproses permintaan.");
        }
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

            <div className="w-82 md:w-full overflow-auto card border border-zinc-300 bg-white flex flex-col p-6 col-span-1 lg:col-span-3">
                <div className="overflow-x-auto rounded-md">
                    {isLoading ? (
                        <div className="text-center py-10 text-zinc-500">Memuat data permintaan...</div>
                    ) : (
                        <table className="
                            w-full border border-zinc-300 border-collapse
                            [&_tr]:h-10  [&_tr]:border [&_tr]:border-zinc-300
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
                                            {/* Data 'user' didapat dari relasi backend include: { user: true } */}
                                            {req.user?.fullname || "User Tidak Diketahui"}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                    {!isLoading && requests.length === 0 && (
                        <div className="text-center py-16 border-x border-b border-zinc-300 text-zinc-400 italic bg-zinc-50/50">
                            Tidak ada permintaan baru saat ini. Anda sudah menyelesaikan semuanya!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}