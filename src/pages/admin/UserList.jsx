import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { findAllUsers } from "@/controllers/user.controller";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";

export default function UserListPage() {
    const navigate = useNavigate();
    const [ usersList, setUsersList ] = useState([]); 
    const styles = {
        admin: "bg-sky-100 px-4 py-1 rounded-sm font-semibold text-sm text-sky-400",
        partner: "bg-green-accent text-green-main-2 px-4 py-1 rounded-sm font-semibold text-sm",
        default: "bg-zinc-200 text-zinc-400 px-4 py-1 rounded-sm font-semibold text-sm"
    }

    useEffect(() => {
        const fetchAllAccount = async () => {
            const users = await findAllUsers();
            setUsersList(users.data);
        }

        fetchAllAccount();
    }, [findAllUsers]);

    return (
        <section className="w-full grid grid-cols-1 h-130 overflow-y-auto">
            <div className="card border-1 border-zinc-300 flex flex-col py-4 px-6">
                <h3 className="text-xl">Daftar Pengguna</h3>
                <p className="text-sm text-zinc-400"><strong>Catatan:</strong> untuk user mobile, geser ke kanan untuk melihat kolom aksi</p>
                <br />
                <div className="w-full overflow-y-hidden flex justify-center flex-col gap-3 rounded-md">
                    <table className="
                        border border-zinc-300 border-collapse
                        [&_tr]:h-10 [&_tr]:border [&_tr]:border-zinc-300
                        [&_th]:px-2 [&_th]:border [&_th]:border-zinc-300
                        [&_td]:px-2 [&_td]:w-fit [&_td]:border [&_td]:border-zinc-300 
                    ">
                        <thead className="bg-zinc-300 text-left font-inter">
                            <tr>
                                <th>No</th>
                                <th>Id</th>
                                <th>Nama Lengkap</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Privilege</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { usersList.map((user, index) => (
                                <tr key={user?.id} className="even:bg-zinc-50">
                                    <td>{index + 1}</td>
                                    <td>{user?.id}</td>
                                    <td>{user?.fullname}</td>
                                    <td>{user?.username}</td>
                                    <td>{user?.email}</td>
                                    <td>
                                        <span className={styles[user?.privilege?.[0].privilege.toLowerCase()]}>{user?.privilege?.[0].privilege}</span>
                                    </td>
                                    <td>
                                        <div className="w-full flex justify-center gap-2">
                                            <button className="cursor-pointer p-1 rounded-md hover:bg-zinc-200 active::bg-zinc-200" onClick={() => navigate(`/dashboard/admin/pengguna/detail/${user.id}`)}>
                                                <EllipsisHorizontalCircleIcon className="size-6 stroke-1" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}