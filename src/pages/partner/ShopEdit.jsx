import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateShop, findShopData } from "@/controllers/shop.controller";
import { ChevronLeftIcon, CloudArrowUpIcon, PhotoIcon } from "@heroicons/react/24/outline";

import placeholder from '@/assets/images/login-illustration.png';

const API_URL = import.meta.env.VITE_API_URL;

export default function ShopEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pfp, setPfp] = useState(null);
    const [banner, setBanner] = useState(null);
    const [shop, setShop] = useState(null);
    
    const [previewPfp, setPreviewPfp] = useState(null);
    const [previewBanner, setPreviewBanner] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchShopData = async (shopId) => {
            try {
                setLoading(true);
                const res = await findShopData(shopId);
                setShop(res);
            } catch (error) {
                console.error("Gagal mengambil data toko:", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchShopData(id);
    }, [id]);

    async function handleFileChangePfp(e) {
        const file = e.target.files[0];
        if (file) {
            setPfp(file);
            setPreviewPfp(URL.createObjectURL(file));
        }
    }

    async function handleFileChangeBanner(e) {
        const file = e.target.files[0];
        if (file) {
            setBanner(file);
            setPreviewBanner(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { deskripsi } = e.target;

        const formData = new FormData();
        if (pfp) formData.append('pfp', pfp);
        if (banner) formData.append('banner', banner);
        formData.append('deskripsi', deskripsi.value);

        try {
            setSubmitting(true);
            await updateShop(id, formData);
            alert("Informasi toko berhasil diperbarui!");
            navigate(`/shop/${id}`); // Menggunakan navigate agar tidak hard-reload
        } catch (error) {
            console.error("Gagal update toko:", error);
            alert("Gagal memperbarui informasi toko.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center gap-3 text-zinc-500 mt-16">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Memuat informasi toko...</p>
            </div>
        );
    }

    return (
        <div className="mt-20 mb-10 flex flex-col items-center justify-center w-full px-4">
            <div className="w-full max-w-4xl flex flex-col gap-4">
                {/* Header Section */}
                <div>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex flex-row items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors w-fit mb-2"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Kembali</span>
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">Edit Informasi Toko</h2>
                    <p className="text-gray-500 text-sm mt-1">Sesuaikan profil dan banner untuk menarik lebih banyak pembeli.</p>
                </div>

                <form className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                    
                    {/* Informasi Dasar */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="nama" className="block font-semibold text-gray-700 mb-1.5">Nama Toko</label>
                            <input 
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none" 
                                type="text" 
                                id="nama" 
                                defaultValue={shop?.nama} 
                                disabled 
                                title="Nama toko tidak dapat diubah"
                            />
                            <p className="text-xs text-gray-400 mt-1">*Nama toko bersifat permanen.</p>
                        </div>
                        
                        <div>
                            <label htmlFor="deskripsi" className="block font-semibold text-gray-700 mb-1.5">Deskripsi Toko</label>
                            <textarea 
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors min-h-[120px]"
                                id="deskripsi" 
                                name="deskripsi" 
                                placeholder="Ceritakan tentang toko Anda..."
                                defaultValue={shop?.deskripsi}
                            ></textarea>
                        </div>
                    </div>

                    <hr className="border-gray-200 my-2" /> 

                    {/* Foto Profil Toko */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-gray-800">Foto Profil Toko</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Current */}
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-500">Saat Ini</p>
                                <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 flex items-center justify-center h-48">
                                    <img 
                                        src={shop?.filePfp ? `${API_URL}/api/images/users/shop/pfp/${shop?.filePfp}` : placeholder} 
                                        alt="Current Profile"
                                        className="w-32 h-32 object-cover rounded-full shadow-sm border-2 border-white"
                                    />
                                </div>
                            </div>
                            {/* Preview */}
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-500">Preview Perubahan</p>
                                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg p-4 flex items-center justify-center h-48 relative overflow-hidden group">
                                    {!previewPfp ? (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <PhotoIcon className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-sm">Belum ada foto baru</span>
                                        </div>
                                    ) : (
                                        <img 
                                            src={previewPfp} 
                                            alt="Preview Profile"
                                            className="w-32 h-32 object-cover rounded-full shadow-sm border-2 border-white"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <label htmlFor="pfp" className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 border-2 border-green-500 text-green-600 font-semibold rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                            <CloudArrowUpIcon className="w-5 h-5" /> Unggah Foto Profil Baru
                        </label>
                        <input name="pfp" type="file" accept="image/*" id="pfp" onChange={handleFileChangePfp} className="hidden" />
                    </div>

                    <hr className="border-gray-200 my-2" />

                    {/* Banner Toko */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-gray-800">Banner Toko</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Current */}
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-500">Saat Ini</p>
                                <div className="border border-gray-200 bg-gray-50 rounded-lg p-2 flex items-center justify-center h-40">
                                    <img 
                                        src={shop?.fileBanner ? `${API_URL}/api/images/users/shop/banner/${shop?.fileBanner}` : placeholder} 
                                        alt="Current Banner"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                            </div>
                            {/* Preview */}
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-500">Preview Perubahan</p>
                                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg p-2 flex items-center justify-center h-40">
                                    {!previewBanner ? (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <PhotoIcon className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-sm">Belum ada banner baru</span>
                                        </div>
                                    ) : (
                                        <img 
                                            src={previewBanner} 
                                            alt="Preview Banner"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <label htmlFor="banner" className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 border-2 border-green-500 text-green-600 font-semibold rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                            <CloudArrowUpIcon className="w-5 h-5" /> Unggah Banner Baru
                        </label>
                        <input name="banner" type="file" accept="image/*" id="banner" onChange={handleFileChangeBanner} className="hidden" />
                    </div>

                    <hr className="border-gray-200 mt-4 mb-2" />
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className={`px-8 py-2.5 rounded-lg font-semibold text-white transition-colors flex items-center gap-2 
                                ${submitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}