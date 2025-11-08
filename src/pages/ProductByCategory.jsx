import { findProductByCategory } from "../controllers/product.controller"
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navigation from "../components/Navigation";
import ProductCard from "../components/ProductCard";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function ProductByCathegory() {

    const navigate = useNavigate();
    
    // Object for controlling
    const tagColor = {
        BAGUS: "text-blue-tag-new border border-blue-tag-new",
        MENENGAH: "text-yellow-tag-mid border border-yellow-tag-mid",
        RUSAK: "text-red-tag-broken border border-red-tag-broken",
        ELEKTRONIK: "text-gray-tag-electronic border border-gray-tag-electronic",
        NON_ELEKTRONIK: "text-green-tag-noelectronic border-green-tag-noelectronic"
    }

    const [ products, setProducts ] = useState([]);
    const { category } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async ( productCategory ) => {
        try {
            const response = await findProductByCategory( productCategory );
            const productData = response.data;
            setProducts(productData);
        } catch (error) {
            console.log(error)
        }}
        fetchData(category);
    }, [category]);
    
    return (
        <div className="mt-16">

            <section className="w-full flex gap-3 flex-col min-[320px]:px-2 min-[480px]:max-sm:px-12 sm:px-0 min-[1280px]:hidden">

                {/* Navigation */}
                <Navigation className="not-sr-only min-[1280px]:sr-only flex justify-between sm:justify-center sm:gap-16" listStyle="dropdown absolute w-40 right-0 sm:-left-2 translate-y-2"/>

                {/* Search bar */}
                <form className="not-sr-only sm:sr-only">
                    <div className="relative">
                        <button className="absolute left-4 top-1/2 -translate-1/2 cursor-pointer" location="header">
                            <MagnifyingGlassIcon className=" size-4 stroke-2"></MagnifyingGlassIcon>
                        </button>
                        <input type="text" className="pl-8 pr-4 input-text-solid font-poppins w-full" placeholder="Cari yang kamu butuhkan"></input>
                    </div>
                </form>
            </section>

            <section className="min-[320px]:px-2 min-[480px]:max-sm:px-12 sm:px-0 mt-4 font-poppins font-semibold">
                <h1 className="text-sm text-stone-600"><span className="">Kategori : </span>{category}</h1>
            </section>

            <hr className="mt-2 text-stone-300 mx-2 sm:mx-0 md:my-2"/>

            {products.length < 1 ? (
                <p className="mt-8 text-center">Belum ada produk untuk kategori <span className="font-semibold text-green-main-2">{category}</span></p>
            ) : (
                <div>
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} tagColor={tagColor} API_URL={API_URL}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductByCathegory