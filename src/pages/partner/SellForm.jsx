import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from "react";
import { addProduct } from "../../controllers/product.controller";
import { useNavigate } from "react-router-dom";

export default function SellForm() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Safety check untuk token
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode(token) : null;

    // Handle file upload & buat preview image
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        // Buat URL sementara untuk preview gambar
        const fileUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(fileUrls);
    };

    // Bersihkan URL preview dari memori saat komponen di-unmount
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formElements = e.target.elements;
        const formData = new FormData();

        // Append multiple files
        for (let i = 0; i < files.length; i++) {
            formData.append('photoProduct', files[i]);
        }

        formData.append('id', formElements.shopId.value);
        formData.append('nama', formElements.nama.value);
        formData.append('deskripsi', formElements.deskripsi.value);
        formData.append('harga', formElements.harga.value);
        formData.append('jenisHarga', formElements.jenisHarga.value);
        formData.append('deskripsiHarga', formElements.deskripsiHarga.value);
        formData.append('detailProduk', formElements.detailProduk.value);
        formData.append('stok', formElements.stok.value);
        formData.append('kategori', formElements.kategori.value);
        formData.append('kualitas', formElements.kualitas.value);

        try {
            const res = await addProduct(formData);
            alert("Produk berhasil diajukan!");
            // Redirect ke halaman toko
            navigate(`/shop/${formElements.shopId.value}`);
        } catch (error) {
            console.error(error);
            alert("Gagal menambahkan produk. Silakan periksa kembali data Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full rounded-md border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all bg-stone-50 focus:bg-white";
    const labelClass = "block text-sm font-semibold text-zinc-700 mb-1.5";

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                {/* Header Section */}
                <div className="bg-green-main-2 px-8 py-6 text-white border-b border-green-700">
                    <h1 className="font-inter font-bold text-2xl">Form Pengajuan Produk Baru</h1>
                    <p className="text-green-100 text-sm mt-1">Admin akan meninjau produk Anda sebelum ditampilkan ke publik.</p>
                </div>

                <form className="p-8 space-y-8" onSubmit={handleSubmit}>
                    <input type="hidden" defaultValue={decode?.idToko || ""} name="shopId" />

                    {/* Section 1: Informasi Dasar */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-zinc-800 border-b border-stone-200 pb-2">Informasi Dasar</h2>
                        
                        <div>
                            <label htmlFor="nama" className={labelClass}>Nama Produk <span className="text-red-500">*</span></label>
                            <input id="nama" name="nama" className={inputClass} placeholder="Contoh: Baju Kemeja Flannel Bekas" maxLength="50" required />
                        </div>

                        <div>
                            <label htmlFor="deskripsi" className={labelClass}>Deskripsi Singkat <span className="text-red-500">*</span></label>
                            <textarea id="deskripsi" name="deskripsi" rows="2" className={`${inputClass} resize-none`} placeholder="Beri deskripsi singkat namun menarik tentang produk Anda..." maxLength={255} required />
                        </div>
                        
                        <div>
                            <label htmlFor="detailProduk" className={labelClass}>Detail Lengkap Produk <span className="text-red-500">*</span></label>
                            <textarea id="detailProduk" name="detailProduk" rows="4" className={inputClass} placeholder="Contoh: Baju warna merah, ukuran L, masih layak pakai 90%, minus pemakaian sedikit di bagian kerah." required />
                        </div>
                    </div>

                    {/* Section 2: Harga & Stok */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-zinc-800 border-b border-stone-200 pb-2">Harga & Ketersediaan</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label htmlFor="harga" className={labelClass}>Harga (Rp) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Rp</span>
                                    <input type="number" id="harga" name="harga" className={`${inputClass} pl-12`} placeholder="150000" min="0" required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="jenisHarga" className={labelClass}>Satuan Jual <span className="text-red-500">*</span></label>
                                <select id="jenisHarga" name="jenisHarga" className={inputClass} required defaultValue="">
                                    <option value="" disabled>Pilih Satuan</option>
                                    <option value="PCS">/ PCS (Pcs)</option>
                                    <option value="LUSIN">/ LUSIN</option>
                                    <option value="PAKET">/ PAKET</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="deskripsiHarga" className={labelClass}>Info Tambahan Harga <span className="text-red-500">*</span></label>
                                <input id="deskripsiHarga" name="deskripsiHarga" className={inputClass} placeholder="Contoh: Harga Pas / Bisa Nego tipis" maxLength={50} required />
                            </div>
                            <div>
                                <label htmlFor="stok" className={labelClass}>Stok Barang Tersedia <span className="text-red-500">*</span></label>
                                <input type="number" id="stok" name="stok" className={inputClass} placeholder="Contoh: 10" min="1" required />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Klasifikasi */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-zinc-800 border-b border-stone-200 pb-2">Klasifikasi Barang</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="kategori" className={labelClass}>Kategori <span className="text-red-500">*</span></label>
                                <select id="kategori" name="kategori" className={inputClass} required defaultValue="">
                                    <option value="" disabled>Pilih Kategori Barang</option>
                                    <option value="ELEKTRONIK">Elektronik</option>
                                    <option value="NON_ELEKTRONIK">Non-Elektronik</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="kualitas" className={labelClass}>Kondisi Barang <span className="text-red-500">*</span></label>
                                <select id="kualitas" name="kualitas" className={inputClass} required defaultValue="">
                                    <option value="" disabled>Pilih Kondisi Fisik</option>
                                    <option value="BAGUS">Bagus / Seperti Baru</option>
                                    <option value="MENENGAH">Menengah / Layak Pakai</option>
                                    <option value="RUSAK">Rusak / Butuh Reparasi</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Upload Media */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-zinc-800 border-b border-stone-200 pb-2">Foto Produk</h2>
                        
                        <div className="w-full">
                            <label 
                                htmlFor="file" 
                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 hover:border-green-500 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <CloudArrowUpIcon className="w-10 h-10 mb-3 text-stone-400" />
                                    <p className="mb-2 text-sm text-stone-500 font-semibold">Klik untuk upload foto</p>
                                    <p className="text-xs text-stone-400">PNG, JPG, JPEG (Bisa lebih dari 1 file)</p>
                                </div>
                                <input type="file" id="file" name="productPhoto" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} multiple required className="hidden" />
                            </label>
                        </div>

                        {/* Image Previews */}
                        {previewUrls.length > 0 && (
                            <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
                                <p className="text-sm font-medium text-zinc-700 mb-3 flex items-center gap-2">
                                    <PhotoIcon className="w-5 h-5 text-green-600" /> 
                                    Foto Terpilih ({previewUrls.length})
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group w-24 h-24 rounded-md overflow-hidden border border-stone-300 shadow-sm bg-white">
                                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-stone-200 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className="px-6 py-2.5 rounded-lg font-semibold text-zinc-600 bg-stone-200 hover:bg-stone-300 transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`px-8 py-2.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2
                                ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-main-2 hover:bg-green-700 shadow-md hover:shadow-lg'}
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Memproses...
                                </>
                            ) : (
                                "Jual Produk Sekarang"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}