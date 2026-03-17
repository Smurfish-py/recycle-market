import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { findAllUsers } from "@/controllers/user.controller";
import { EllipsisHorizontalCircleIcon, MagnifyingGlassIcon, UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function UserListPage() {
    const navigate = useNavigate();
    const userInfo = useOutletContext();
    const privilege = userInfo?.privilege?.[0]?.privilege;

    const [usersList, setUsersList] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const styles = {
        admin: "bg-sky-100 text-sky-600 px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider",
        partner: "bg-green-100 text-green-700 px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider",
        default: "bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider"
    }

    // Admin Checking
    useEffect(() => {
        if (userInfo !== null) {
            if (privilege !== "ADMIN") {
                navigate("/");
            }
        }
    }, [userInfo, privilege, navigate]);

    useEffect(() => {
        const fetchAllAccount = async () => {
            try {
                setLoading(true);
                const users = await findAllUsers();
                setUsersList(users.data);
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAllAccount();
    }, []);

    // Logika Pencarian
    const filteredUsers = usersList.filter(user => 
        user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="w-full flex flex-col gap-4 h-full pb-10 font-inter">
            {/* Header & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-stone-800">Daftar Pengguna</h2>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">Kelola hak akses dan detail pengguna terdaftar.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-green-main-2 focus:border-green-main-2 block w-full pl-10 px-4 py-2.5 outline-none transition-all "
                        placeholder="Cari nama, username, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-transparent md:bg-white md:rounded-md md:border md:border-zinc-200 w-full">
                
                {loading ? (
                    <div className="flex justify-center items-center py-16 bg-white rounded-md border border-zinc-200">
                        <div className="flex items-center gap-3 text-zinc-500">
                            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-md animate-spin"></div>
                            <span className="font-medium animate-pulse">Memuat data pengguna...</span>
                        </div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-md border border-zinc-200 text-zinc-500 italic">
                        {searchTerm ? `Pengguna "${searchTerm}" tidak ditemukan.` : "Belum ada pengguna terdaftar."}
                    </div>
                ) : (
                    <>
                        {/* 1. TAMPILAN MOBILE (Card Layout) */}
                        <div className="md:hidden flex flex-col gap-4">
                            {filteredUsers.map((user, index) => (
                                <div key={user?.id} className="bg-white border border-zinc-200 rounded-xl p-4  flex flex-col gap-3">
                                    <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                                        <div>
                                            <h3 className="font-bold text-stone-800 text-lg">{user?.fullname}</h3>
                                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">ID: {user?.id}</p>
                                        </div>
                                        <span className={styles[user?.privilege?.[0]?.privilege?.toLowerCase()] || styles.default}>
                                            {user?.privilege?.[0]?.privilege || "DEFAULT"}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5 text-sm text-zinc-600 mb-2">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="w-4 h-4 text-zinc-400" />
                                            <span>@{user?.username}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <EnvelopeIcon className="w-4 h-4 text-zinc-400" />
                                            <span className="truncate">{user?.email}</span>
                                        </div>
                                    </div>

                                    <button 
                                        className="w-full bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 py-2 rounded-md font-semibold text-xs transition-colors text-center"
                                        onClick={() => navigate(`/dashboard/admin/pengguna/detail/${user.id}`)}
                                    >
                                        Lihat Detail
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* 2. TAMPILAN DESKTOP (Table Layout) */}
                        <div className="hidden md:block overflow-x-auto rounded-md">
                            <table className="w-full text-sm text-left text-gray-500 border-collapse">
                                <thead className="font-poppins text-xs text-gray-700 uppercase bg-gray-50 border-b border-zinc-200 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 whitespace-nowrap">No</th>
                                        <th className="px-6 py-4 whitespace-nowrap text-center">ID</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Nama Lengkap</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Username</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Email</th>
                                        <th className="px-6 py-4 whitespace-nowrap text-center">Privilege</th>
                                        <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user?.id} className="bg-white border-b border-stone-200 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-400 text-center">{user?.id}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{user?.fullname}</td>
                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">@{user?.username}</td>
                                            <td className="px-6 py-4 text-gray-600">{user?.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={styles[user?.privilege?.[0]?.privilege?.toLowerCase()] || styles.default}>
                                                    {user?.privilege?.[0]?.privilege || "DEFAULT"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-full flex justify-center gap-2">
                                                    <button 
                                                        className="text-sky-500 hover:bg-sky-50 hover:text-sky-700 p-1.5 rounded-md transition-colors cursor-pointer border border-transparent hover:border-sky-200" 
                                                        onClick={() => navigate(`/dashboard/admin/pengguna/detail/${user.id}`)}
                                                        title="Lihat Detail"
                                                    >
                                                        <EllipsisHorizontalCircleIcon className="w-6 h-6 stroke-2" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}