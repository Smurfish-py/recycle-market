import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

import placeholder from '@/assets/images/login-illustration.png';
import { getBookMarkList } from '@/controllers/product.controller';
import isTokenExpired from '@/service/isTokenExpired';

import ProductCard from '@/components/ProductCard';
import { BookmarkIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL;

// PINDAH KE LUAR: Agar tidak dibuat ulang setiap kali komponen re-render
const tagColor = {
    BAGUS: "text-blue-tag-new border border-blue-tag-new",
    MENENGAH: "text-yellow-tag-mid border border-yellow-tag-mid",
    RUSAK: "text-red-tag-broken border border-red-tag-broken",
    ELEKTRONIK: "text-gray-tag-electronic border border-gray-tag-electronic",
    NON_ELEKTRONIK: "text-green-tag-noelectronic border-green-tag-noelectronic"
};

export default function BookmarkPage() {
    // Beri nilai awal array kosong [], bukan undefined
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading
    const [error, setError] = useState(null);         // Tambahkan state error

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; // Mencegah memory leak jika komponen di-unmount sebelum fetch selesai

        const fetchBookmarkList = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Pengecekan token dipindah ke sini agar lebih aman
                if (!token || isTokenExpired(token)) {
                    navigate('/login');
                    return;
                }

                setIsLoading(true);
                const decoded = jwtDecode(token);
                const res = await getBookMarkList(decoded.id);
                
                if (isMounted) {
                    // Pastikan yang diset adalah array
                    setProducts(Array.isArray(res) ? res : []); 
                }
            } catch (err) {
                console.error("Gagal mengambil data markah:", err);
                if (isMounted) setError("Gagal memuat data markah. Silakan coba lagi nanti.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchBookmarkList();

        return () => { isMounted = false; };
    }, [navigate]); // Masukkan navigate ke dependency array

    // 1. Tampilan saat Loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-main-2"></div>
            </div>
        );
    }

    // 2. Tampilan Utama
    return (
        <div className="mt-16 w-full flex flex-col items-center">
            <div className="w-full flex flex-col h-fit gap-2 md:border md:border-zinc-300 rounded-2xl overflow-hidden mb-8">
                {/* Gambar diatur tingginya secara spesifik (misal: h-32 untuk mobile, lg:h-64 untuk desktop) */}
                <img 
                    src={placeholder} 
                    alt="Banner Markah" 
                    className="h-32 md:h-48 lg:h-64 w-full object-cover" 
                />
                
                {/* Teks dibiarkan mengambil ruang sisanya dengan padding yang proporsional */}
                <section className="flex flex-col justify-center px-6 md:px-10 pb-6 pt-2">
                    <h2 className="text-2xl md:text-4xl font-semibold text-zinc-800">Markah Saya</h2>
                    <h4 className="text-sm md:text-base text-zinc-500 mt-1">Lihat barang-barang yang sudah kamu simpan</h4>
                </section>
            </div>

            {/* 3. Tampilan saat Error Server */}
            {error && (
                <div className="w-full max-w-3xl mt-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-md text-center">
                    {error}
                </div>
            )}

            {/* 4. Tampilan Empty State vs Grid Produk */}
            {!error && products.length === 0 ? (
                <section className='text-center leading-8 bg-zinc-50 w-full py-16 mt-6 rounded-lg border border-zinc-100'>
                    <div className="flex justify-center mb-4 text-zinc-300">
                        <BookmarkIcon className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-700">Kamu belum nyimpen barang nih!</h3>
                    <p className='mt-2 text-zinc-500'>
                        Klik ikon <i className='inline-flex border border-green-main-2 text-green-main-2 p-0.5 rounded-sm bg-white mx-1'><BookmarkIcon className='size-4' /></i> 
                        atau tombol <span className='bg-green-main-2 text-white px-2 py-1 text-xs rounded-sm mx-1'>Simpan ke Markah</span> 
                        pada halaman produk untuk melihatnya nanti!
                    </p>
                </section>
            ) : (
                <section className='w-full mt-6 lg:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12'>
                    {/* Element Loop: Gunakan ID produk sebagai key jika memungkinkan */}
                    {products.map((product) => (
                        <ProductCard 
                            key={product?.id || product?.produk?.id} // Ganti dengan property ID unik yang sesuai dari API Anda
                            tagColor={tagColor} 
                            product={product} 
                            API_URL={API_URL} 
                        />
                    ))}
                </section>
            )}
        </div>
    )
}