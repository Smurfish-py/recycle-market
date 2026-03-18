import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

import placeholder from '@/assets/images/login-illustration.png';
import { getBookMarkList } from '@/controllers/product.controller';
import isTokenExpired from '@/service/isTokenExpired';

import ProductCard from '@/components/ProductCard';
import { BookmarkIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL;

const tagColor = {
    BAGUS: "text-blue-tag-new border border-blue-tag-new",
    MENENGAH: "text-yellow-tag-mid border border-yellow-tag-mid",
    RUSAK: "text-red-tag-broken border border-red-tag-broken",
    ELEKTRONIK: "text-gray-tag-electronic border border-gray-tag-electronic",
    NON_ELEKTRONIK: "text-green-tag-noelectronic border-green-tag-noelectronic"
};

export default function BookmarkPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; 

        const fetchBookmarkList = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token || isTokenExpired(token)) {
                    navigate('/login');
                    return;
                }

                setIsLoading(true);
                const decoded = jwtDecode(token);
                const res = await getBookMarkList(decoded.id);
                
                if (isMounted) {
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
    }, [navigate]); 

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-main-2"></div>
            </div>
        );
    }

    return (
        <div className="mt-16 w-full flex flex-col items-center">
            <div className="w-full flex flex-col h-fit gap-2 md:border md:border-zinc-300 rounded-2xl overflow-hidden mb-8">
 
                <img 
                    src={placeholder} 
                    alt="Banner Markah" 
                    className="h-32 md:h-48 lg:h-64 w-full object-cover" 
                />
 
                <section className="flex flex-col justify-center px-6 md:px-10 pb-6 pt-2">
                    <h2 className="text-2xl md:text-4xl font-semibold text-zinc-800">Markah Saya</h2>
                    <h4 className="text-sm md:text-base text-zinc-500 mt-1">Lihat barang-barang yang sudah kamu simpan</h4>
                </section>
            </div>

            {error && (
                <div className="w-full max-w-3xl mt-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-md text-center">
                    {error}
                </div>
            )}

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
                    {products.map((product) => (
                        <ProductCard 
                            key={product?.id || product?.produk?.id}
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