import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { findAllUsers } from "@/controllers/user.controller";
import { EllipsisHorizontalCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function UserListPage() {
    const navigate = useNavigate();
    const userInfo = useOutletContext();
    const privilege = userInfo?.privilege?.[0]?.privilege;

    const [usersList, setUsersList] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const styles = {
        admin: "bg-sky-100 text-sky-600 px-2.5 py-1 rounded-full font-semibold text-xs",
        partner: "bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold text-xs",
        default: "bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold text-xs"
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
        <section className="w-full flex flex-col gap-4 h-full pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">Daftar Pengguna</h2>
                    <p className="text-sm text-zinc-500 mt-1">Kelola hak akses dan detail pengguna terdaftar.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5 outline-none transition-all"
                        placeholder="Cari nama, username, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4">No</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Nama Lengkap</th>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Privilege</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                            Memuat data pengguna...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">
                                        {searchTerm ? "Pengguna tidak ditemukan." : "Belum ada pengguna terdaftar."}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user?.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">{user?.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{user?.fullname}</td>
                                        <td className="px-6 py-4 text-gray-600">@{user?.username}</td>
                                        <td className="px-6 py-4 text-gray-600">{user?.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={styles[user?.privilege?.[0]?.privilege?.toLowerCase()] || styles.default}>
                                                {user?.privilege?.[0]?.privilege}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-full flex justify-center gap-2">
                                                <button 
                                                    className="text-gray-400 hover:text-green-600 transition-colors cursor-pointer" 
                                                    onClick={() => navigate(`/dashboard/admin/pengguna/detail/${user.id}`)}
                                                    title="Lihat Detail"
                                                >
                                                    <EllipsisHorizontalCircleIcon className="w-7 h-7 stroke-2" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}