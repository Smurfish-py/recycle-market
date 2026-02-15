import { useEffect, useMemo, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { userData } from "@/controllers/user.controller";
import { useNavigate } from "react-router-dom";
import { registerShop, findShopDataByUser } from "@/controllers/shop.controller";

import isTokenExpired from "@/service/isTokenExpired.js";

export default function PartnershipForm() {
    const [ user, setUser ] = useState({});
    const [ toko, setToko ] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token == null || isTokenExpired(token)) {
            navigate('/login');
            return;
        }
        const decode = jwtDecode(token);

        const findShop = async (idUser) => {
            const res = await findShopDataByUser(idUser);
            setToko(res);
            
            if (res.length > 0) {
                return navigate(`/shop/${res?.[0]?.id}`);
            }
        }

        const fetchdata = async (id) => {
            const res = await userData(id);
            setUser(res?.data);
        }

        findShop(decode?.id);
        fetchdata(decode?.id);
    }, [userData])

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const idUser = e.target.idUser.value;
        const nama = e.target.nama.value;
        const deskripsi = e.target.deskripsi.value;
        const noHp = e.target.noHp.value;

        const addShop = async (data) => {
            try {
                const res = await registerShop(data);
                localStorage.setItem('token', res?.token);
                if (alert(res.message) && res) {
                    navigate('/');
                }

            } catch (error) {
                return alert(error?.response?.data?.message);
            }
        }
        addShop({ idUser, nama, deskripsi, noHp })
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen pt-16 md:px-0">
            <div className="card flex flex-col px-4 pt-4 pb-4 sm:border sm:border-zinc-300 h-screen sm:h-fit w-screen sm:w-120">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">GREENSHIFT PARTNERSHIP</h2>
                    <p>by Recycle Market</p>
                </div>
                <hr className="text-zinc-300 mt-4 mb-2" />
                <h2 className="text-lg font-semibold mb-2">Akun Pendaftar</h2>
                <div className="card border border-zinc-300 rounded-md flex items-center gap-2 px-2 w-full">
                    <UserCircleIcon className="size-18" />
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <h3 className="text-lg font-semibold">{user?.fullname}</h3> 
                            <p className="text-sm">{user?.email}</p>
                        </div>
                        <h3 className="opacity-50 text-right">@{user?.username}</h3>
                    </div>
                </div>
                <hr className="text-zinc-300 my-2" />
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input type="hidden" name="idUser" defaultValue={user?.id} />
                    <div className="flex flex-col gap-2">
                        <div>
                            <label htmlFor="namaToko" className="font-semibold">Nama Toko</label> <br />
                            <input id="namaToko" name="nama" type="text" className="w-full border border-zinc-300 rounded-sm px-2" placeholder="Contoh: Toko Hijau" required /> <br />
                        </div>
                        <div>
                            <label htmlFor="deskripsi" className="font-semibold">Deskripsi Toko</label> <br />
                            <textarea id="deskripsi" name="deskripsi" type="text" className="w-full min-h-15 border border-zinc-300 rounded-sm px-2" placeholder="Contoh: Toko ini merupakan tempat untuk membeli botol bekas" required></textarea>
                        </div>
                        <div>
                            <label htmlFor="noHp" className="font-semibold">Nomor Whatsapp Business</label> <br />
                            <p className="font-normal text-sm">(Nomor ini akan disimpan di akun utama anda)</p>
                            <input id="noHp"name="noHp" type="text" className="w-full border border-zinc-300 rounded-sm px-2" placeholder="Contoh: 0812345678" required /> <br />
                        </div>
                        
                    </div>
                    <p className="text-sm border border-orange-300 bg-orange-50 text-orange-400 p-4">Setiap orang hanya dapat membuat <strong>satu</strong> halaman toko. Nama dan deskripsi <strong>tidak dapat diubah atau diedit</strong> setelah toko dibuat. Pikirkanlah baik-baik!</p>
                    <button className="bg-green-main-2/80 hover:bg-green-main-2 active:bg-green-main-2 cursor-pointer px-4 py-2 rounded-sm text-center text-white font-semibold">Submit</button> 
                </form>
            </div>
        </div>
    )
}