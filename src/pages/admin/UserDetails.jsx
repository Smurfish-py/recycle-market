import { useParams } from "react-router-dom";
import { userData } from "@/controllers/user.controller";
import { useState, useEffect } from "react";
import { 
    ArrowRightEndOnRectangleIcon, ChevronLeftIcon, UserCircleIcon, CalendarDaysIcon,
    UserIcon,
    PhoneIcon,
    HomeIcon
} from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserDetails() {
    const [ user, setUser ] = useState(null);
    const { id } = useParams();

    const styles = {
        ADMIN: "bg-sky-100 text-sky-400 border border-sky-400",
        PARTNER: "bg-green-accent text-green-main-2 border border-green-main-2",
        DEFAULT: "bg-zinc-200 text-zinc-400 border border-zinc-400"
    }

    useEffect(() => {
        const fetchData = async (uid) => {
            const res = await userData(uid);
            setUser(res.data);
        }

        fetchData(id);
    }, [userData]);

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
        <section className="grid grid-cols-1 gap-6 py-2 px-4 h-130 overflow-y-auto">
            <div>
                <button onClick={() => window.history.back()} className="flex flex-row items-center cursor-pointer pl-1 pr-2 py-1 rounded-md hover:bg-zinc-200 active:bg-zinc-200 select-none">
                    <ChevronLeftIcon className="size-4" /><p>Kembali</p>
                </button>
                <h2 className="text-2xl font-semibold">Detail Profil</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-2 gap-4 sm:gap-0">
                <div className="flex flex-row items-center gap-8">
                    {user?.profilePfp == undefined ? (
                        <UserCircleIcon className="size-30" />
                    ) : (
                        <img src={`${API_URL}/api/images/users/${user?.profilePfp}`} className="aspect-square object-cover rounded-full size-30" />
                    )}
                    <div>
                        <div>
                            <h3 className="text-2xl">{user?.fullname}</h3>
                            <h4 className="opacity-50">@{user?.username}</h4>
                        </div>
                        
                        <p className={`w-fit px-1.5 py-0.5 rounded-md font-semibold text-xs text-center mt-6 ${styles[user?.privilege?.[0].privilege]}`}>{user?.privilege?.[0]?.privilege}</p>
                    </div>
                </div>
                <div className="grid grid-rows-1 sm:grid-rows-2 gap-x-4 gap-y-2 pr-4">
                    <p className="flex flex-row gap-2 items-center">
                        <span className="">
                            <ArrowRightEndOnRectangleIcon className="size-5" />
                        </span>
                        <span className="text-sm">Login Terakhir: {formatDateTime(user?.lastOnline)}</span>
                    </p>
                </div>
            </div>
            
            <hr className="border-zinc-300" />
            
            <section className="card border border-zinc-300 h-fit rounded-md p-6 flex flex-col">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="border border-green-main-2 bg-green-accent text-green-main-2 rounded-full p-0.5 h-fit">
                            <UserIcon className="size-8" />
                        </div>
                        <h2 className="text-2xl font-semibold">Informasi Pengguna</h2>
                    </div>
                    <p className="hidden sm:block">{user?.fullname}</p>
                </div>
                <hr className="my-4 text-zinc-300" />
                <div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="opacity-50">Email</p>
                        <p className="underline underline-offset-2 col-span-2 sm:col-span-1">{user?.email}</p>
                        <p className="text-right font-semibold hidden sm:block">@{user?.username}</p>
                    </div>
                    <hr className="my-4 text-zinc-300" />
                    <div className="grid grid-cols-3 gap-2">
                        <p className="opacity-50">Telepon</p>
                        <p className="flex flex-row gap-2 items-center col-span-2 sm:col-span-1">
                            <PhoneIcon className="size-4 hidden sm:block" />
                            <span>{user?.noHp ? user?.noHp : "Tidak ada"}</span>
                        </p>
                    </div>
                    <hr className="my-4 text-zinc-300" />
                    <div className="grid grid-cols-3 gap-2">
                        <p className="opacity-50">Tanggal Daftar</p>
                        <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
                            <CalendarDaysIcon className="size-5 hidden sm:block" />
                            <span>{formatDateTime(user?.createdAt)}</span>
                        </p>
                    </div>
                    <hr className="my-4 text-zinc-300" />
                    <div className="grid grid-cols-3 gap-2">
                        <p className="opacity-50">Alamat Rumah</p>
                        <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
                            <HomeIcon className="size-5 lg:size-7 hidden sm:block" />
                            <span>{user?.alamat ? user?.alamat : "Tidak ada"}</span>
                        </p>
                    </div>
                </div>
            </section>
            {user?.privilege?.[0]?.privilege != 'ADMIN' && (
                <section className="card border border-red-300 bg-red-400/20 text-red-400 h-fit rounded-md p-6 flex flex-col">
                    <h2 className="text-2xl font-semibold">Zona Berbahaya</h2>
                    <p>Pikirkan secara matang, setiap aksi pada zona ini tidak dapat dikembalikan atau dibuat ulang</p>
                    <br />
                    <button
                        className="btn-solid border-none px-4 py-2 bg-red-400 hover:bg-red-500 cursor-pointer"
                        onClick={() => confirm(`Apakah anda yakin ingin menghapus user ${user?.fullname}?`)}
                    >
                        HAPUS AKUN
                    </button>
                </section> 
            )}
        </section>
    );
}