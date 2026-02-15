import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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
    const [ enableEdit, setEnableEdit ] = useState(false);
    const [ user, setUser ] = useState(null);

    const token = localStorage.getItem('token');

    const tagColor = {
        BAGUS: "text-blue-tag-new border border-blue-tag-new",
        MENENGAH: "text-yellow-tag-mid border border-yellow-tag-mid",
        RUSAK: "text-red-tag-broken border border-red-tag-broken",
        ELEKTRONIK: "text-gray-tag-electronic border border-gray-tag-electronic",
        NON_ELEKTRONIK: "text-green-tag-noelectronic border-green-tag-noelectronic"
    }

    useEffect(() => {

        const decode = token ? jwtDecode(token) : null;

        async function  fetchUserInfo(id) {
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

        fetchShopData(id);
        fetchProductList(id);
    }, [id]);

    const statusStyle = {
        PENDING: "bg-amber-100 border-amber-400 text-amber-400",
        APPROVE: "bg-green-accent"
    }
    
    return (
        <div className="mt-16 w-full">
            <div className="flex flex-col rounded-t-lg lg:min-h-120 w-full relative">
                <img src={placeholder} className='h-20 lg:h-70 rounded-t-lg object-cover brightness-80' />
                <div className='flex flex-col lg:flex-row'>
                    <div className='h-12 lg:flex-1/4'>
                        {/* DiV Kosong */}
                    </div>
                    <div className='flex-3/4 p-4'>
                        <section>
                            <h2 className='text-2xl lg:text-4xl font-semibold'>{shop?.nama}</h2>
                            <div className='mt-2 flex justify-between w-fit gap-2'>
                                <section className='btn text-xs lg:text-base bg-green-accent font-normal flex items-center gap-2 border w-fit px-2 py-0.5'>
                                    <UserIcon className='size-5 lg:size-6' />
                                    {user?.username}
                                </section>
                                <section className={`btn text-xs lg:text-base border ${statusStyle[shop?.shopStatus]} font-normal flex items-center gap-2 lg:w-50 px-2 py-0.5`}>
                                    { shop?.shopStatus != "PENDING" ? (
                                        <>
                                            <CheckBadgeIcon className='size-5 lg:size-6' />
                                            Partner Terverifikasi
                                        </>
                                    ) : (
                                        <>
                                            <ExclamationTriangleIcon className='size-5 lg:size-6' /> 
                                            Belum Terverifikasi
                                        </>
                                    )}
                                </section>
                            </div>
                            <p className='text-sm lg:text-base p-2 my-4 rounded-md bg-green-accent/60 border border-green-main-2/80'>{shop?.deskripsi}</p>
                            <br />
                            { !enableEdit && ownerState && (
                                <section className='grid grid-cols-2 gap-4'>
                                    <button type='button' className='btn-solid' onClick={() => navigate('/sell')}>
                                        Jual Barang
                                    </button>
                                    <button type='button' className='btn' onClick={() => setEnableEdit(true)}>
                                        Kelola Toko
                                    </button>
                                </section>
                            )}
                            
                        </section>
                    </div>
                </div>
                <img src={placeholder} className='absolute left-6 lg:left-1/12 top-8 lg:top-2/5 size-25 lg:size-45 rounded-full object-cover object-left border border-zinc-400'/>
            </div>
            {/* <hr className='my-4 text-zinc-400/80' /> */}
            {products?.length < 1 ? (
                <div className='h-10 w-full flex items-center justify-center'>
                    <p>Yahh, Toko ini belum menjual barang apapun</p>
                </div>
            ) : (
                <>
                    <h3 className='w-full lg:text-center py-4 text-xl'>Barang kami</h3>
                    <div className='grid grid-cols-1 sm:justify-items-center sm:grid-cols-2 md:gap-y-5 lg:grid-cols-3'>
                        {products?.map((product, index) => (
                            <ProductCard key={index} tagColor={tagColor} product={product} API_URL={API_URL} />
                        ))}
                    </div>
                    <p className='w-full text-center opacity-70 mt-2'>Anda sudah melihat semua produk :D</p>
                </>
                
            )}
            
        </div>
    )
}