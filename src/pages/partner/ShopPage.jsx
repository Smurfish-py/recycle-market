import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { UserIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

import placeholder from '@/assets/images/login-illustration.png';
import { findShopData, findShopDataByUser } from '@/controllers/shop.controller';
import { userData } from '@/controllers/user.controller';
import isTokenExpired from '@/service/isTokenExpired';

export default function ShopPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [ shop, setShop ] = useState(null);
    const [ products, setProducts ] = useState(null);
    const [ ownerState, setOwnerState ] = useState(false);
    const [ enableEdit, setEnableEdit ] = useState(false);
    const [ user, setUser ] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token == null || isTokenExpired(token)) {
            navigate('/login');
            return;
        }
        const decode = jwtDecode(token);

        async function findShop(idUser) {
            const res = await findShopDataByUser(idUser);

            if (res?.[0]?.idUser == decode.id) {
                setOwnerState(true);
            }
        }

        async function  fetchUserInfo(id) {
            const res = await userData(id);
            setUser(res?.data);
        }

        async function fetchShopData(id) {
            const res = await findShopData(id);
            await fetchUserInfo(res?.idUser);
            setShop(res);
        }

        findShop(decode?.id);
        fetchShopData(id);
    }, []);

    const statusStyle = {
        PENDING: "bg-amber-100 border-amber-400 text-amber-400",
        APPROVE: "bg-green-accent"
    }
    
    return (
        <div className="mt-16 w-full">
            <div className="flex flex-col border border-zinc-300 rounded-t-lg min-h-120 w-full relative">
                <img src={placeholder} className='h-70 object-cover brightness-80' />
                <div className='flex-2 flex flex-row'>
                    <div className='flex-1/4'>
                        {/* DiV Kosong */}
                    </div>
                    <div className='flex-3/4 p-4'>
                        <section>
                            <h2 className='text-4xl font-semibold'>{shop?.nama}</h2>
                            <p>{shop?.deskripsi}</p>
                            <div className='mt-2 flex justify-between w-fit gap-2'>
                                <section className={`btn border ${statusStyle[shop?.shopStatus]} font-normal flex items-center gap-2 w-50 px-2 py-0.5`}>
                                    { shop?.shopStatus != "PENDING" ? (
                                        <>
                                            <CheckBadgeIcon className='size-6' />
                                            Partner Tersertifikasi
                                        </>
                                    ) : (
                                        <>
                                            <ExclamationTriangleIcon className='size-6' /> 
                                            Belum Tersertifikasi
                                        </>
                                    )}
                                    
                                    
                                </section>
                                <section className='btn bg-green-accent font-normal flex items-center gap-2 border w-fit px-2 py-0.5'>
                                    <UserIcon className='size-6' />
                                    {user?.username}
                                </section>
                            </div>
                            <br />
                            { !enableEdit && ownerState && (
                                <section className='grid grid-cols-2 gap-4'>
                                    <button type='button' className='btn' onClick={() => setEnableEdit(true)}>
                                        Edit Foto Toko
                                    </button>
                                    <button type='button' className='btn-solid' onClick={() => navigate('/sell')}>
                                        Edit Foto Toko
                                    </button>
                                </section>
                            )}
                            
                        </section>
                    </div>
                </div>
                <img src={placeholder} className='absolute left-1/12 top-2/5 size-45 rounded-full object-cover object-left border border-zinc-400'/>
            </div>
        </div>
    )
}