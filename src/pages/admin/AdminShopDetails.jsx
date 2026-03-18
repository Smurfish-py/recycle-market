import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BuildingStorefrontIcon, UserIcon, TrashIcon, ArrowLeftIcon, TagIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function AdminShopDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [toko, setToko] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchShopDetail = async () => {
            try {
                const response = await fetch(`${API_URL}/api/toko/detail/admin/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (!response.ok) throw new Error("Toko tidak ditemukan");
                
                const data = await response.json();
                setToko(data);
            } catch (error) {
                console.error(error);
                alert("Gagal memuat detail toko!");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShopDetail();
    }, [id, API_URL, navigate]);

    const handleDelete = async () => {
        const isConfirm = window.confirm(`PERINGATAN! Anda yakin ingin menghapus toko "${toko.nama}"? \n\nSemua produk, foto, dan markah dari toko ini juga akan terhapus secara permanen. Tindakan ini tidak bisa dibatalkan!`);
        
        if (!isConfirm) return;

        try {
            const response = await fetch(`${API_URL}/api/toko/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.ok) {
                alert("Toko berhasil dihapus!");
                navigate('/admin');
            } else {
                const errorData = await response.json();
                alert(`Gagal menghapus: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Terjadi kesalahan jaringan.");
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <p className="text-zinc-500 font-medium animate-pulse">Memuat detail toko...</p>
            </div>
        );
    }

    if (!toko) return null;

    return (
        <div className="font-inter max-w-7xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-zinc-500 hover:text-green-600 transition font-semibold text-sm mb-2"
                    >
                        <ArrowLeftIcon className="size-4 stroke-2" /> Kembali ke Daftar Toko
                    </button>
                    <h2 className="text-2xl font-bold text-stone-800 tracking-tight">Detail Manajemen Toko</h2>
                    <p className="text-sm text-zinc-500">Tinjau informasi lengkap, produk, dan hak akses mitra.</p>
                </div>
                
                <div className="px-4 py-2 bg-white border border-zinc-200 rounded-lg shadow-sm flex items-center gap-3">
                    <span className="text-sm text-zinc-500 font-medium">Status Pengajuan:</span>
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        toko.shopStatus === 'APPROVE' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                    }`}>
                        {toko.shopStatus}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-md overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-green-main-2 to-green-main-2/60"></div>
                        <div className="px-6 sm:px-8 pb-8">
                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-10 mb-6">
                                <div className="bg-white p-2 rounded-2xl shadow-xs border border-zinc-100">
                                    <div className="w-20 h-20 bg-green-50 rounded-xl flex items-center justify-center text-green-main-2">
                                        <BuildingStorefrontIcon className="size-10" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-stone-800">{toko.nama}</h3>
                                    <p className="text-sm text-zinc-500 font-medium flex items-center gap-1">
                                        <TagIcon className="size-4" /> ID Toko: {toko.id}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-zinc-50 rounded-md p-5 border border-zinc-100">
                                <h4 className="text-sm font-bold text-stone-800 mb-2 uppercase tracking-wide">Deskripsi Toko</h4>
                                <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                                    {toko.deskripsi || <span className="italic text-zinc-400">Pemilik belum menambahkan deskripsi toko.</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-md p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-stone-800">Daftar Produk</h3>
                            <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold">
                                {toko.produk.length} Item
                            </span>
                        </div>

                        {toko.produk.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {toko.produk.map((p) => (
                                    <div key={p.id} className="group p-4 bg-white border border-zinc-200 rounded-md hover:border-green-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <span className="font-semibold text-stone-800 line-clamp-2 leading-tight">{p.nama}</span>
                                                <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                                                    p.status === 'LOLOS' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'TIDAK_LOLOS' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-zinc-100 text-zinc-600'
                                                }`}>
                                                    {p.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                                            <span className="text-sm text-zinc-500 font-medium">Harga</span>
                                            <span className="text-green-600 font-bold">{formatRupiah(p.harga || 0)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                                <BuildingStorefrontIcon className="size-12 mx-auto text-zinc-300 mb-3" />
                                <p className="text-zinc-500 font-medium">Toko ini belum mengunggah produk apapun.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-md p-6">
                        <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2 border-b border-zinc-100 pb-4">
                            <UserIcon className="size-5 text-emerald-600" /> Informasi Pemilik
                        </h3>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl uppercase shadow-inner">
                                {toko.user?.fullname ? toko.user.fullname.charAt(0) : '?'}
                            </div>
                            <div>
                                <p className="font-bold text-stone-800 text-lg">{toko.user?.fullname || "Tanpa Nama"}</p>
                                <p className="text-xs text-zinc-500 font-medium">Terdaftar sebagai Mitra</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-md border border-zinc-100">
                                <EnvelopeIcon className="size-5 text-zinc-400 mt-0.5 shrink-0" />
                                <div className="overflow-hidden">
                                    <span className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Email Akses</span>
                                    <span className="font-medium text-stone-700 truncate block">{toko.user?.email}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-md border border-zinc-100">
                                <PhoneIcon className="size-5 text-zinc-400 mt-0.5 shrink-0" />
                                <div>
                                    <span className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Nomor HP</span>
                                    <span className="font-medium text-stone-700">{toko.user?.noHp || <span className="italic text-zinc-400">Belum disetel</span>}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-rose-200 rounded-md shadow-sm p-6 relative overflow-hidden">
                        <h3 className="font-bold text-rose-700 mb-2 flex items-center gap-2">
                            <TrashIcon className="size-5" /> Danger Zone
                        </h3>
                        <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                            Tindakan ini akan menghapus toko, beserta <strong className="text-rose-600">semua produk dan data terkait</strong> secara permanen dari database.
                        </p>
                        
                        <button 
                            onClick={handleDelete}
                            className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-bold py-2.5 rounded-md transition-all duration-200"
                        >
                            <TrashIcon className="size-5" />
                            Hapus Toko Permanen
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}