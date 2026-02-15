import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

import placeholder from '@/assets/images/login-illustration.png';
import { getBookMarkList } from '@/controllers/product.controller';
import isTokenExpired from '@/service/isTokenExpired';

import ProductCard from '@/components/ProductCard'

const API_URL = import.meta.env.VITE_API_URL;

export default function BookmarkPage() {
    const [ products, setProducts ] = useState();

    const navigate = useNavigate();
    
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode(token) : null;

    const tagColor = {
        BAGUS: "text-blue-tag-new border border-blue-tag-new",
        MENENGAH: "text-yellow-tag-mid border border-yellow-tag-mid",
        RUSAK: "text-red-tag-broken border border-red-tag-broken",
        ELEKTRONIK: "text-gray-tag-electronic border border-gray-tag-electronic",
        NON_ELEKTRONIK: "text-green-tag-noelectronic border-green-tag-noelectronic"
    }

    useEffect(() => {
        if (token == null || isTokenExpired(token)) navigate('/login');

        const bookmarkList = async (idUser) => {
            const res = await getBookMarkList(idUser);
            setProducts(res);
        }

        bookmarkList(decode?.id);
    }, []);

    return (
        <div className="mt-16 w-full">
            <div className="w-full flex flex-col h-fit lg:h-80 gap-2 md:border md:border-zinc-300 rounded-t-2xl">
                <img src={placeholder} className='h-20 md:flex-1/3 lg:h-full w-full object-cover rounded-t-2xl' />
                <section className='md:flex-1/3 flex flex-col justify-center px-10 pb-2'>
                    <h2 className='text-xl md:text-4xl font-semibold'>Markah Saya</h2>
                    <h4 className='text-xs md:text-base'>Lihat barang-barang yang sudah kamu simpan</h4>
                </section>
            </div>
            <h2 className='text-xl md:text-2xl my-6 text-center'>Produk yang kamu simpan</h2>
            <section>
                {/* Element Loop */}
                {Array.isArray(products) && products.map((product, index) => (
                
                    // Card
                    console.log(product)
                    // <ProductCard key={index} tagColor={tagColor} product={product} API_URL={API_URL} />
                ))}
            </section>
        </div>
    )
}