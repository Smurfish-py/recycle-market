import { useOutletContext, useNavigate } from "react-router-dom";
import { findAllUsers, protectedPage, countUsers } from "@/controllers/user.controller";
import { countProducts } from "@/controllers/product.controller";
import { useEffect, useState } from "react";
import { ExclamationTriangleIcon, ShoppingBagIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function Admin() {
    const [ usersList, setUsersList ] = useState([]);
    const [ adminAccount, setAdminAccount ] = useState([]);
    const [ usersCount, setUsersCount ] = useState(0);
    const [ userTotal, setUserTotal ] = useState(0);
    const [ product, setProduct ] = useState(0);
    const [ productTotal, setProductTotal ] = useState(0);

    const userInfo = useOutletContext();
    const navigate = useNavigate();

    const privilege = userInfo?.privilege?.[0]?.privilege;

    useEffect(() => {
        const fetchAllAccount = async () => {
            const res = await findAllUsers();
            setUsersList(res.data);
        }
        fetchAllAccount();
    }, [findAllUsers]);

    useEffect(() => {
        const admins = usersList.filter(user => user?.privilege?.[0]?.privilege === "ADMIN");
        setAdminAccount(admins);
    }, [usersList]);

    console.log(adminAccount)

    useEffect(() => {
        const userCount = async () => {
            const res = await countUsers();
            const {users, ...rest} = res.data;
            setUsersCount(res.data);
            setUserTotal(
                Object
                .values(rest)
                .reduce((jumlah, nilai) => jumlah + nilai, 0)
            );
        }
        userCount();
    }, [countUsers]);

    useEffect(() => {
        const productCount = async () => {
            const res = await countProducts();
            const {products, ...rest} = res.data;
            setProduct(res.data);
            setProductTotal(
                Object
                .values(rest)
                .reduce((jumlah, nilai) => jumlah + nilai, 0)
            )
        }

        productCount();
    }, [countProducts]);

    useEffect(() => {
        const checkPrivilege = async () => {
            const checkAllowed = await protectedPage(['ADMIN'], privilege);

            if (!checkAllowed) {
                navigate('/');
                return;
            }
        };

        if (privilege) {
            checkPrivilege();
        }
    }, [privilege, navigate]);

    return (
        <>
            <p className="text-xl font-semibold text-stone-500 mb-4">Informasi Layanan</p>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card border-1 border-zinc-300 h-45 flex flex-col px-6">
                    <div className="flex-3/7 flex items-center justify-between">
                        <h3 className="font-poppins font-normal text-lg">Pengguna Terdaftar</h3>
                        <i className="bg-green-accent p-2 border-1 border-green-main-2 text-green-main-2 rounded-md">
                            <UserGroupIcon className="size-7"/>
                        </i>
                    </div>
                    <div className="flex-4/7 flex justify-center flex-col gap-3">
                        <h2 className="text-5xl">{ userTotal }</h2>
                        <p className="flex gap-1">
                            <span className="bg-sky-200 text-sky-400 py-0.5 px-2 rounded-sm text-xs">{ usersCount?.admins } Admin</span>
                            <span className="bg-green-accent text-green-main-2 py-0.5 px-2 rounded-sm text-xs">{ usersCount?.partners } Partner</span>
                            <span className="bg-zinc-200 text-zinc-400 py-0.5 px-2 rounded-sm text-xs">{ usersCount?.defaultUsers } Default</span>
                        </p>
                    </div>
                </div>
                <div className="card border-1 border-zinc-300 h-45 flex flex-col px-6">
                    <div className="flex-3/7 flex items-center justify-between">
                        <h3 className="font-poppins font-normal text-lg">Produk Terdaftar</h3>
                        <i className="bg-green-accent p-2 border-1 border-green-main-2 text-green-main-2 rounded-md">
                            <ShoppingBagIcon className="size-7"/>
                        </i>
                    </div>
                    <div className="flex-4/7 flex justify-center flex-col gap-3">
                        <h2 className="text-5xl"> { productTotal } </h2>
                        <p className="flex gap-1">
                            <span className="bg-green-accent text-green-main-2 py-0.5 px-2 rounded-sm text-xs">{ product?.nonElectronics } Non Elektronik</span>
                            <span className="bg-zinc-200 text-zinc-400 py-0.5 px-2 rounded-sm text-xs">{ product?.electronics } Elektronik</span>
                        </p>
                    </div>
                </div>
                <div className="card border-1 border-zinc-300 h-45 flex flex-col px-6">
                    <div className="flex-3/7 flex items-center justify-between">
                        <h3 className="font-poppins font-normal text-lg">Jumlah Pengaduan</h3>
                        <i className="bg-green-accent p-2 border-1 border-green-main-2 text-green-main-2 rounded-md">
                            <ExclamationTriangleIcon className="size-7"/>
                        </i>
                    </div>
                    <div className="flex-4/7 flex justify-center flex-col gap-3">
                        <h2 className="text-5xl">15</h2>
                        <p className="flex gap-1">
                            <span className="bg-rose-100 text-rose-400 py-0.5 px-2 rounded-sm text-xs">Belum Dibaca</span>
                        </p>
                    </div>
                </div>
                <div className="card border-1 border-zinc-300 h-fit flex flex-col py-4 px-6 col-span-1 lg:col-span-3 gap-8">
                    <div className="flex-3/7">
                        <h3 className="font-poppins font-normal text-lg">Daftar Admin</h3>
                        <p className="text-sm text-zinc-400"><strong>Catatan:</strong> Admin dapat melihat siapa saja yang menjadi admin. Akan tetapi tidak bisa mengubah apapun terhadap akun admin yang ditampilkan</p>
                    </div>
                    <div className="flex-4/7 overflow-y-hidden flex justify-center flex-col gap-3 rounded-md">
                        <table className="
                        border border-zinc-300 border-collapse
                        [&_tr]:h-10 [&_tr]:border [&_tr]:border-zinc-300
                        [&_th]:px-2 [&_th]:border [&_th]:border-zinc-300
                        [&_td]:px-2 [&_td]:w-fit [&_td]:border  [&_td]:border-zinc-300 
                        ">
                            <thead className="bg-zinc-300 text-left font-inter">
                                <tr>
                                    <th>No</th>
                                    <th>Id</th>
                                    <th>Nama Lengkap</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                { adminAccount.map((admin, index) => (
                                    <tr key={admin.id} className="even:bg-zinc-50">
                                        <td>{index + 1}</td>
                                        <td>{admin?.id}</td>
                                        <td>{admin?.fullname}</td>
                                        <td>{admin?.username}</td>
                                        <td>{admin?.email}</td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    )
}