import { useEffect, useState } from "react";
import { protectedPage, userData } from "../controllers/user.controller";
import { findRelatedProduct, deleteProductById } from "../controllers/product.controller.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import isTokenExpired from "../service/isTokenExpired.js";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function ShopPage() {
    const [ userDetails, setUserDetails ] = useState(null);
    const [ product, setProduct ] = useState([]);
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    if (token == null) {
        useEffect(() => {
            navigate('/login');
        }, [navigate]);

        return null;
    } else if (isTokenExpired(token)) {
        useEffect(() => {
            navigate('/login');
        }, [navigate]);
    }

    const fetchData = async (id) => {
        try {
            const res = await userData(id);
            setUserDetails(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const productData = async (id) => {
        try {
          const res = await findRelatedProduct(id);
            setProduct(res);  
        } catch (error) {
            console.log(error);
        }
        
    }

    const handleDelete = async (id) => {
        try {
            await deleteProductById(id);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const decode = jwtDecode(token);
    const privilege = decode.privilege;
    const userId = decode.id;
    const idToko = decode.idToko;

    useEffect(() => {
        const userIsAllowed = protectedPage(['admin', 'seller'], privilege);

        if (!userIsAllowed) {
            navigate('/partnership');
        }
    }, [privilege, navigate]);

    useEffect(() => {
        if (userId) {
            fetchData(userId);
            productData(idToko);
        }
    }, [userId]);

    return (
        <section className="mt-16">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p>Selamat datang {userDetails?.fullname}</p>
            <br />
            <div className="flex flex-col gap-4">
                <div className="w-fit flex flex-row gap-4">
                    <div className="flex-1 rounded-md border-1 border-stone-200 w-full flex justify-center items-end gap-2 px-4 py-2">
                        <h1 className="font-semibold text-6xl">{product.length}</h1>
                        <h3>Produk Terdaftar</h3>
                    </div>
                    <a className="btn-solid w-full flex flex-col items-center justify-center cursor-pointer" onClick={() => navigate('/sell')}>
                        <PlusIcon className="size-6 stroke-4" />
                        <h1>Jual Produk</h1>
                    </a>
                </div>
                <div className="card border-1 border-stone-200 px-2 py-4 flex flex-col items-center gap-8">
                    <div>
                        <h1 className="font-inter font-semibold text-2xl">Produk Anda</h1>
                        <p className="text-sm text-stone-400 md:sr-only">Untuk mobile, geser ke kanan untuk melihat opsi</p>
                    </div>
                    
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-400">
                                    <th className="px-2 py-2">No. </th>
                                    <th className="px-2 min-w-30">Nama Produk</th>
                                    <th className="sr-only px-2 md:not-sr-only">Kategori</th>
                                    <th className="px-2">Status</th>
                                    <th className="px-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((data, index) => (
                                    <tr key={index} className="odd:bg-stone-100 font-poppins text-sm content-center">
                                        <td className="px-2 py-2 max-w-5">{index + 1}</td>
                                        <td className="px-2">{data.nama}</td>
                                        <td className="sr-only px-2 max-w-10 md:not-sr-only">{data.kategori}</td>
                                        <td className="px-2 lg:max-w-10">{data.status}</td>
                                        <td className="px-2 lg:max-w-10">
                                            <div className="flex gap-2">
                                                <a className="text-orange-400 cursor-pointer hover:underline active:underline">EDIT</a>
                                                <button className="text-red-500 cursor-pointer hover:underline active:underline" onClick={() => {confirm(`Apakah anda yakin ingin menghapus ${data.nama}?`) ? handleDelete(data.id) : "" }}>HAPUS</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}