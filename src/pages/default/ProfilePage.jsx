import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

import { ChevronLeftIcon, CubeIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, HomeIcon, UserCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

import { userData } from '@/controllers/user.controller';
import isTokenExpired from '@/service/isTokenExpired.js';

import placeholder from '@/assets/images/login-illustration.png';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
    const [ user, setUser ] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token || isTokenExpired(token)) return navigate('/login');
    }, [token]);

    const decode = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    }, [token]);
    
    const fetchUserData = async (id) => {
        try {
            const res = await userData(id);
            await setUser(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUserData(decode?.id);
    }, []);

    const formatDateTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="mt-16 w-full lg:w-full flex flex-col justify-center items-center min-h-100 gap-2">
            <div className='w-full lg:w-200'>
                <button
                    className='flex flex-row items-center gap-2 p-2 cursor-pointer hover:bg-zinc-200 rounded-md'
                    onClick={() => navigate('/')}
                >
                    <ChevronLeftIcon className='size-5' /> Kembali
                </button>
            </div>
            <div className='w-full lg:w-200 pb-2 flex flex-col border border-stone-300 rounded-xl'>
                <div className="h-30 lg:h-40 overflow-hidden">
                    <img src={user?.profilePfp == null ? placeholder : `${API_URL}/api/images/users/${user?.profilePfp}`} className='w-full h-full object-cover object-center rounded-t-xl brightness-50' />
                </div>
                <hr className='text-stone-300' />
                <div className="lg:min-h-60 flex flex-row justify-between gap-4 lg:gap-8 px-2 lg:px-4">
                    <div className='w-1/3 flex justify-center items-center'>
                        {user?.profilePfp == null ? (
                            <UserCircleIcon className='size-50 text-green-main-2/80' />
                        ) : (
                            <img src={`${API_URL}/api/images/users/${user?.profilePfp}`} className='size-20 lg:size-45 border border-zinc-600 rounded-full aspect-square object-cover object-left' />
                        )}
                    </div>
                    <div className='w-2/3 px-4 flex flex-col justify-center gap-2 lg:gap-6 lg:px-6 lg:py-4'>
                        <section>
                            <h2 className='text-lg lg:text-2xl font-semibold'>
                                {user?.fullname}
                                {user?.privilege?.[0]?.privilege == 'PARTNER' && (
                                    <CheckBadgeIcon className='inline-block align-text-top lg:align-middle ml-2 size-5 lg:size-6 text-green-main-2 ' />
                                )}
                                {user?.privilege?.[0]?.privilege == 'ADMIN' && (
                                    <CubeIcon className='inline-block align-text-top lg:align-middle ml-2 size-5 lg:size-6 text-green-main-2 ' />
                                )}
                            </h2>
                            <p className='text-sm text-zinc-600/70'>{user?.email} <span className='hidden lg:inline-block align-middle '>| @{user?.username}</span></p>
                            <p className='text-sm lg:hidden text-zinc-600/70'>@{user?.username}</p>
                            <p className='text-sm text-zinc-600/70'>{user?.noHp}</p>
                        </section>
                        <section>
                            <button className='btn-solid rounded-sm text-sm lg:text-base cursor-pointer border-none bg-green-main-2/80 hover:bg-green-main-2 active:bg-green-main-2' onClick={() => {navigate('/profile/edit')}}>Edit Profil</button>
                        </section>
                    </div>
                </div>
            </div>
            <div className='w-full lg:w-200 flex flex-col border border-stone-300 rounded-xl'>
                <div className="min-h-20 flex flex-col gap-8 p-4">
                    <div>
                        <section className='lg:text-xl font-semibold flex flex-row items-center gap-2'>
                            <HomeIcon className='size-4 lg:size-6' />
                            Alamat Utama
                        </section>
                        <section className='text-sm lg:text-base bg-zinc-200 mt-2 lg:mt-4 p-2 rounded-sm'>
                            {user?.alamat || (<span className='italic opacity-40'>Belum mengisi alamat</span>)}
                        </section>
                    </div>
                </div>
            </div>
            <div className='w-full lg:w-200 flex flex-col border border-stone-300 rounded-xl'>
                <div className="min-h-20 flex flex-col gap-8 p-4">
                    <div>
                        <section className='lg:text-xl font-semibold flex flex-row items-center gap-2'>
                            <CalendarDaysIcon className='size-4 lg:size-6' />
                            Tanggal Daftar
                        </section>
                        <section className='text-sm lg:text-base bg-zinc-200 mt-2 lg:mt-4 p-2 rounded-sm'>
                            {
                                formatDateTime(user?.createdAt)
                            }
                        </section>
                    </div>
                </div>
            </div>
            <div className='w-full lg:w-200 flex flex-col border border-red-300 rounded-xl'>
                <div className="gap-8 p-4">
                    <button className='btn-solid border-none bg-red-400/80 hover:bg-red-400 active:bg-red-400 cursor-pointer w-full' onClick={() => {
                        confirm("Apakah anda yakin untuk logout?");
                        localStorage.removeItem('token');
                        navigate('/');
                    }}>Logout</button>
                </div>
            </div>
        </div>
    )
}