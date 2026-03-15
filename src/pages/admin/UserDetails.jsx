import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { userData } from "@/controllers/user.controller";
import { 
    ArrowRightEndOnRectangleIcon, ChevronLeftIcon, UserCircleIcon, CalendarDaysIcon,
    UserIcon, PhoneIcon, HomeIcon, EnvelopeIcon
} from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const userInfo = useOutletContext();
    const privilege = userInfo?.privilege?.[0]?.privilege;

    // --- PERBAIKAN PRIVILEGE CHECKING ---
    useEffect(() => {
        // Tunggu sampai context tidak null (sudah selesai di-load)
        if (userInfo !== null) {
            if (privilege !== "ADMIN") {
                navigate("/");
            }
        }
    }, [userInfo, privilege, navigate]);
    // ------------------------------------

    useEffect(() => {
        const fetchData = async (uid) => {
            try {
                setLoading(true);
                const res = await userData(uid);
                setUser(res.data);
            } catch (error) {
                console.error("Gagal mengambil detail user:", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchData(id);
        }
    }, [id]);

    const formatDateTime = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return d.toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const styles = {
        ADMIN: "bg-sky-100 text-sky-600 px-3 py-1 rounded-full font-semibold text-xs border border-sky-200",
        PARTNER: "bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-xs border border-green-200",
        DEFAULT: "bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold text-xs border border-gray-200"
    };

    if (loading) {
        return (
            <div className="w-full h-96 flex flex-col justify-center items-center gap-3 text-zinc-500">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Memuat detail profil...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full p-6 text-center text-zinc-500">
                <p>Data pengguna tidak ditemukan.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 hover:underline">Kembali</button>
            </div>
        );
    }

    const userPrivilege = user?.privilege?.[0]?.privilege || "DEFAULT";

    return (
        <section className="flex flex-col gap-6 py-2 px-4 h-full pb-10">
            {/* Header & Back Button */}
            <div>
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex flex-row items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Kembali</span>
                </button>
                <h2 className="text-2xl font-semibold text-gray-800">Detail Profil</h2>
            </div>
            
            {/* Kartu Profil Utama */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-6">
                <div className="flex flex-row items-center gap-6">
                    {user?.profilePfp ? (
                        <img 
                            src={`${API_URL}/api/images/users/${user?.profilePfp}`} 
                            alt={user?.fullname}
                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-4 border-gray-50 shadow-sm" 
                        />
                    ) : (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-gray-100 rounded-full border-4 border-gray-50 shadow-sm text-gray-400">
                            <UserCircleIcon className="w-16 h-16" />
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-bold text-gray-900">{user?.fullname}</h3>
                        <h4 className="text-gray-500 font-medium">@{user?.username}</h4>
                        <div className="mt-3">
                            <span className={styles[userPrivilege] || styles.DEFAULT}>
                                {userPrivilege}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 w-full sm:w-auto">
                    <p className="flex items-center gap-2 text-gray-600 text-sm">
                        <ArrowRightEndOnRectangleIcon className="w-5 h-5 text-gray-400" />
                        <span>Login Terakhir: <br className="hidden sm:block" /> <span className="font-medium text-gray-800">{formatDateTime(user?.lastOnline)}</span></span>
                    </p>
                </div>
            </div>
            
            {/* Informasi Pengguna */}
            <section className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 flex flex-col">
                <div className="flex flex-row justify-between items-center mb-6">
                    <div className="flex flex-row gap-3 items-center">
                        <div className="bg-green-100 text-green-600 rounded-lg p-2">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Informasi Kontak & Personal</h2>
                    </div>
                </div>
                
                <div className="flex flex-col gap-0 divide-y divide-gray-100 border border-gray-100 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 hover:bg-gray-50 transition-colors">
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <EnvelopeIcon className="w-4 h-4" /> Email
                        </p>
                        <p className="sm:col-span-2 font-medium text-gray-900">{user?.email}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 hover:bg-gray-50 transition-colors">
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4" /> Telepon
                        </p>
                        <p className="sm:col-span-2 font-medium text-gray-900">{user?.noHp ? user?.noHp : <span className="text-gray-400 italic">Tidak ada</span>}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 hover:bg-gray-50 transition-colors">
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <CalendarDaysIcon className="w-4 h-4" /> Terdaftar Sejak
                        </p>
                        <p className="sm:col-span-2 font-medium text-gray-900">{formatDateTime(user?.createdAt)}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 hover:bg-gray-50 transition-colors">
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <HomeIcon className="w-4 h-4" /> Alamat Rumah
                        </p>
                        <p className="sm:col-span-2 font-medium text-gray-900 leading-relaxed">
                            {user?.alamat ? user?.alamat : <span className="text-gray-400 italic">Tidak ada</span>}
                        </p>
                    </div>
                </div>
            </section>

            {/* Zona Berbahaya */}
            {userPrivilege !== 'ADMIN' && (
                <section className="bg-red-50 rounded-xl border border-red-200 p-6 flex flex-col items-start gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-red-700">Zona Berbahaya</h2>
                        <p className="text-sm text-red-600 mt-1">Pikirkan secara matang, setiap aksi pada zona ini tidak dapat dikembalikan atau dibatalkan.</p>
                    </div>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-red-200 outline-none"
                        onClick={() => {
                            const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus akun milik ${user?.fullname} secara permanen?`);
                            if (confirmDelete) {
                                // TODO: Panggil fungsi delete user API di sini
                                alert("Fitur hapus belum terhubung ke API");
                            }
                        }}
                    >
                        Hapus Akun Pengguna
                    </button>
                </section> 
            )}
        </section>
    );
}