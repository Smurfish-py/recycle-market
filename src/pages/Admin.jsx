import { EnvelopeIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { findAllUsers } from "@/controllers/user.controller";
import { findAllProducts } from "../controllers/product.controller";

export default function Admin() {
    const [ userData, setUserData ] = useState([]);
    const [ productData, setProductData ] = useState([]);
    const [ page, setPage ] = useState(null);

    const fetchUser = async () => {
        const res = await findAllUsers();
        if (res !== undefined || res !== null) {
            setUserData(res.data);
        } else {
            setUserData([]);
        }
    }

    const fetchProduct = async () => {
        const res = await findAllProducts();
        if (res !== undefined || res !== null) {
            setProductData(res.data);
        } else {
            setProductData([]);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchProduct();

    }, []);

    const dashboard = (
        <div className="w-full px-2">
            <h1 className="font-inter font-semibold text-2xl mb-6">DASHBOARD</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="border border-stone-300 rounded-md px-4 py-2"></div>
                <div className="border border-stone-300 rounded-md px-4 py-2">
                    <h2>AKUN TERDAFTAR</h2>
                    <div className="text-5xl text-right">
                        {userData.length}
                    </div>
                </div>
                <div className="border border-stone-300 rounded-md px-4 py-2">
                    <h2>PRODUK TERDAFTAR</h2>
                    <div className="text-5xl text-right">
                        {productData.length}
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )

    const mail = (
        <>
            p
        </>
    )

    return (
        <div className="mt-16 flex flex-col gap-6">
            <aside className="flex items-center px-2 py-2 md:py-4 h-full gap-2 flex-1/12 border border-stone-300 rounded-md">
                <button className="btn text-sm w-fit" onClick={() => setPage(dashboard)}>
                    <HomeIcon className="size-6 stroke-2" />
                </button>
                <button className="btn text-sm w-fit" onClick={() => setPage(mail)}>
                    <EnvelopeIcon className="size-6 stroke-2" />    
                </button>                
            </aside>
            <div className="flex-11/12">
                { page == null ? dashboard : page }
            </div>
        </div>
    )
}