import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { 
    ExclamationTriangleIcon, 
    PencilSquareIcon,
    ArchiveBoxXMarkIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { UserIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

import placeholder from '@/assets/images/login-illustration.png';
import { findShopData } from '@/controllers/shop.controller';
import { userData } from '@/controllers/user.controller';
import { findProductByShopId } from '@/controllers/product.controller';
import isTokenExpired from '@/service/isTokenExpired';
import ProductCard from '@/components/ProductCard';

const API_URL = import.meta.env.VITE_API_URL;

export default function ShopPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [ shop, setShop ] = useState(null);
    const [ products, setProducts ] = useState(null);
    const [ ownerState, setOwnerState ] = useState(false);
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const token = localStorage.getItem('token');

    const tagColor = {
        BAGUS: "text-blue-tag-new border border-blue-tag-new bg-blue-50",
        MENENGAH: "text-yellow-tag-mid border border-yellow-tag-mid bg-yellow-50",
        RUSAK: "text-red-tag-broken border border-red-tag-broken bg-red-50",
        ELEKTRONIK: "text-gray-tag-electronic border border-gray-tag-electronic bg-gray-50",
        NON_ELEKTRONIK: "text-green-tag-noelectronic border border-green-tag-noelectronic bg-green-50"
    }

    useEffect(() => {
        const decode = token ? jwtDecode(token) : null;

        if (token == null || isTokenExpired(token)) {
            navigate('/login');
            return;
        }

        async function fetchUserInfo(id) {
            const res = await userData(id);
            setUser(res?.data);
        }

        async function fetchProductList(id) {
            const res = await findProductByShopId(id);
            setProducts(res?.data);
        }

        async function fetchShopData(id) {
            const res = await findShopData(id);
            await fetchUserInfo(res?.idUser);
            setShop(res);
            if (res?.idUser == decode?.id) {
                setOwnerState(true);
            }
        }

        async function loadAllData() {
            setLoading(true);
            await Promise.all([
                fetchShopData(id),
                fetchProductList(id)
            ]);
            setLoading(false);
        }

        loadAllData();
    }, [id]);

    const statusStyle = {
        PENDING: "bg-amber-100 border-amber-400 text-amber-600",
        APPROVE: "bg-green-accent border-green-main-2 text-green-main-2"
    }
    
    if (loading) {
        return (
            <div className="min-h-[70vh] w-full flex flex-col items-center justify-center text-green-main-2">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-main-2 mb-4"></div>
                <p className="font-poppins font-semibold animate-pulse text-stone-600">Mempersiapkan Toko...</p>
            </div>
        );
    }

    return (
        <div className="w-full lg:px-4 mt-16 mx-auto pb-20 font-inter">
            {/* HEADER TOKO (Banner & PFP) */}
            <div className="relative w-full bg-white rounded-lg border border-zinc-300 mb-8">
                {/* Banner */}
                <div className="relative h-48 md:h-64 w-full rounded-t-lg overflow-hidden bg-zinc-200">
                    <img 
                        src={shop?.fileBanner ? `${API_URL}/api/images/users/shop/banner/${shop?.fileBanner}` : placeholder} 
                        className="w-full h-full object-cover brightness-75" 
                        alt="Banner Toko"
                    />
                    {/* Tombol Edit Toko (Jika Pemilik) dipindah ke atas agar lebih rapi */}
                    {ownerState && (
                        <button 
                            onClick={() => navigate(`/shop/${id}/edit`)}
                            className="absolute top-4 right-4 bg-white backdrop-blur-sm text-stone-700 hover:brightness-90 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
                        >
                            <PencilSquareIcon className="size-4 stroke-2" /> Edit Profil Toko
                        </button>
                    )}
                </div>

                {/* Konten Profil (PFP dan Info) */}
                <div className="px-6 md:px-10 pb-8 relative">
                    {/* Foto Profil Melayang */}
                    <div className="absolute -top-16 md:-top-20 left-6 md:left-10">
                        <img 
                            src={shop?.filePfp ? `${API_URL}/api/images/users/shop/pfp/${shop?.filePfp}` : placeholder} 
                            className="size-32 md:size-40 rounded-full object-cover object-center border-4 md:border-8 border-white shadow-md bg-white"
                            alt="Logo Toko"
                        />
                    </div>

                    {/* Info Toko */}
                    <div className="pt-20 md:pt-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl text-stone-800 font-poppins tracking-tight">
                                {shop?.nama}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs md:text-sm font-medium">
                                    <UserIcon className="size-4 text-zinc-400" />
                                    Pemilik: {user?.username}
                                </span>
                                
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs md:text-sm ${statusStyle[shop?.shopStatus]}`}>
                                    {shop?.shopStatus !== "PENDING" ? (
                                        <><CheckBadgeIcon className="size-4" /> Partner Terverifikasi</>
                                    ) : (
                                        <><ExclamationTriangleIcon className="size-4" /> Menunggu Verifikasi</>
                                    )}
                                </span>
                            </div>

                            <p className="mt-5 text-sm md:text-base text-zinc-600 leading-relaxed max-w-3xl">
                                {shop?.deskripsi}
                            </p>
                        </div>

                        {/* Tombol Aksi Pemilik Toko */}
                        {!isTokenExpired(token) && ownerState && (
                            <div className="flex flex-col sm:flex-row gap-3 md:min-w-fit">
                                <button 
                                    onClick={() => navigate('/sell')}
                                    className="btn-solid py-1.5 px-3 rounded-sm text-sm flex justify-center items-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    Jual Barang
                                </button>
                                <button 
                                    onClick={() => navigate(`/shop/${id}/manage`)}
                                    className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-300 font-semibold py-1 px-2 rounded-md flex justify-center items-center gap-2 shadow-sm"
                                >
                                    <Cog6ToothIcon className="size-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DAFTAR PRODUK */}
            <div className="px-4 md:px-0">
                <div className="flex items-center gap-3 mb-6">
                    {/* <ShoppingBagIcon className="size-7 text-green-main-2" /> */}
                    <h2 className="font-inter text-2xl font-medium text-stone-800 w-full text-center">Etalase Toko</h2>
                </div>

                {products?.length < 1 ? (
                    /* EMPTY STATE YANG LEBIH BAIK */
                    <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-zinc-100 p-4 rounded-full mb-4">
                            <ArchiveBoxXMarkIcon className="size-12 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-700 mb-1">Belum ada produk</h3>
                        <p className="text-zinc-500 max-w-sm">
                            Toko ini sepertinya belum mengunggah barang daur ulang apapun untuk dijual.
                        </p>
                        {ownerState && (
                            <button onClick={() => navigate('/sell')} className="mt-6 text-green-main-2 font-semibold hover:underline">
                                Mulai jual barang sekarang &rarr;
                            </button>
                        )}
                    </div>
                ) : (
                    /* GRID PRODUK */
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {products?.map((product, index) => (
                                <ProductCard key={index} tagColor={tagColor} product={product} API_URL={API_URL} />
                            ))}
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-4 opacity-50">
                            <div className="h-px bg-zinc-400 w-16"></div>
                            <p className="text-sm font-medium text-zinc-500">Semua produk telah ditampilkan</p>
                            <div className="h-px bg-zinc-400 w-16"></div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}