import { useEffect, useState } from "react";
import { protectedPage, userData } from "../controllers/user.controller";
import { findRelatedProduct, deleteProductById } from "../controllers/product.controller.js";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import isTokenExpired from "../service/isTokenExpired.js";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function ShopPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [ userDetails, setUserDetails ] = useState(null);
    const [ decode, setDecode ] = useState(null);
    const [ products, setProducts ] = useState([]);
    const [ product, setProduct ] = useState(location.state?.products || null);
    const token = localStorage.getItem('token');
    
    // const decode = jwtDecode(token);

    useEffect(() => {
        if (token == null || isTokenExpired(token)) {
            navigate('/login');
            return;
        }

        setDecode(jwtDecode(token))
    }, [navigate]);

    const privilege = decode?.privilege;
    const userId = decode?.id;
    const idToko = decode?.idToko;

    const fetchData = async (id) => {
        try {
            if (!id) return;
            const res = await userData(id);
            setUserDetails(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const productData = async (id) => {
        try {
            if (!id) return;
            const res = await findRelatedProduct(id);
            setProducts(res);  
        } catch (error) {
            console.log(error);
        }   
    }

    const handleDelete = async (id) => {
        try {
            if (!id) return;
            await deleteProductById(id);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const checkPrivilege = async () => {
            const userIsAllowed = await protectedPage(['ADMIN', 'PARTNER'], privilege);

            if (!userIsAllowed) {
            navigate('/partnership');
        }

        checkPrivilege();
        }

    }, [privilege, navigate]);

    useEffect(() => {
        if (!userId || !idToko) return
        fetchData(userId);
        productData(idToko);
    }, [userId]);

    useEffect(() => {
        if (product == null) {
            fetchData(userId);
        }
    }, [userId]);

    return (
        <section className="mt-16">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p>Selamat datang, {userDetails?.fullname}</p>
            <p className="text-sm text-stone-400"><strong>Tips:</strong> Jika produk tidak di acc, coba perpendek deskripsi harga dan deskripsi singkat pada saat mengisi form jual produk</p>
            <br />
            <div className="flex flex-col gap-4">
                <div className="w-fit flex flex-row gap-4">
                    <div className="flex-1 rounded-md border-1 border-stone-200 w-full flex justify-center items-end gap-2 px-4 py-2">
                        <h1 className="font-semibold text-6xl">{products.length}</h1>
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
                                {products.map((data, index) => (
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