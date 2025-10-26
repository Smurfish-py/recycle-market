import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import findAllProducts from "../controllers/product.controller";
import Skeleton from "../components/Skeleton";

// Icons
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await findAllProducts();
                const productData = await response.data;
                setProducts(productData);
            } catch (error) {
                console.log({ error: error });
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const skeleton = () => {
        let elements = [];

        for (let i = 0; i < 4; i++) {
            elements.push(<Skeleton key={i}/>);
        }

        return elements;
    }

    return (
        <div className="flex flex-col items-center pt-16 gap-1">

            {/* Navigation for small devices*/}
            <section className="w-full flex gap-3 flex-col min-[320px]:px-2 min-[480px]:max-sm:px-12 sm:px-0 lg:hidden">
                <Navigation className="not-sr-only min-[1280px]:sr-only flex justify-between sm:justify-center sm:gap-16" listStyle="dropdown absolute w-40 right-0 sm:-left-2 translate-y-2"/>
                <form className="not-sr-only sm:sr-only">
                    <div className="relative">
                        <button className="absolute left-4 top-1/2 -translate-1/2 cursor-pointer" location="header">
                            <MagnifyingGlassIcon className=" size-4 stroke-2"></MagnifyingGlassIcon>
                        </button>
                        <input type="text" className="pl-8 pr-4 input-text-solid font-poppins w-full" placeholder="Cari yang kamu butuhkan"></input>
                    </div>
                </form>
            </section>

            {/* Main Content */}
            <article className="w-full flex flex-col gap-1 mt-4">

                {/* Hero Section */}
                <section id="hero" className="sr-only font-inter text-center flex flex-col gap-4 lg:py-8 select-none lg:not-sr-only">
                    <h3 className="text-xl">Kelompok 13</h3>
                    <h1 className="font-semibold text-8xl">RECYCLE MARKET</h1>
                    <h2 className="font-semibold text-2xl">Resell, Reuse, Recycle</h2>
                </section>

                {/* Product Section */}
                {loading ? (

                    // Skeleton
                    <section className="grid grid-cols-1 sm:justify-items-center sm:grid-cols-2 md:gap-y-5 lg:grid-cols-3 ">
                        {skeleton()}
                    </section>  

                ) : (

                    // Products
                    <section className="grid grid-cols-1 sm:grid-cols-2 sm:justify-items-center md:gap-y-5 lg:grid-cols-3">

                    {/* Element Loop */}
                    {products.map((product, index) => (
                        
                        // Card
                        <div key={index} className="card items-center sm:max-md:w-full px-2 min-[480px]:max-[640px]:px-12 flex gap-4 md:gap-2 md:flex-col md:items-start">

                            {/* Product picture */}
                            <div className="cursor-pointer md:h-40 transition duration-300 hover:brightness-75" onClick={() => navigate(`/product/${product.id}`)}>
                                {
                                product.fotoProduk?.[0]?.file ? (
                                    
                                    <img src={`${API_URL}/api/images/products/${product.fotoProduk[0].file}`} className="size-26 rounded-md object-cover object-top md:w-80 md:h-40 sm:object-cover md:object-[25%_15%]" />
                                    
                                    
                                ) : (
                                    <div className="size-26 rounded-md bg-gray-200 flex items-center justify-center text-xs text-center md:w-80 md:h-40">
                                        <p className="font-inter font-semibold text-gray-400">No image yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="h-full py-3 flex flex-col gap-4 justify-center sm:px-2 sm:gap-4">

                                {/* Product name and Seller */}
                                <div>

                                    {/* Product Name */}
                                    <h2 className="hyperlink font-inter font-semibold md:text-xl" onClick={() => navigate(`/product/${product.id}`)}>{product.nama}</h2>

                                    {/* Seller */}
                                    <div className="flex flex-row gap-1">
                                        <UserCircleIcon className="size-4 md:size-5"></UserCircleIcon>
                                        <h4 className="hyperlink font-poppins font-normal text-xs md:text-sm" onClick={() => navigate(`/toko/${product.toko.nama}`)}>{product.toko.nama}</h4>
                                    </div>

                                </div>

                                {/* Product price and tags */}
                                <div className="flex flex-col md:gap-2">

                                    {/* Price */}
                                    <h3 className="font-inter font-semibold text-xl md:text-2xl">Rp. {product.harga} <span className="text-sm">/{product.jenisHarga}</span></h3>

                                    {/* Tags */}
                                    <div>
                                        <a href="" className={`text-xs border-1 py-0.5 px-1.5 md:text-sm rounded-full ${product.kategori === 'NON_ELEKTRONIK' ? "text-green-tag-noelectronic border-green-tag-noelectronic" : "text-gray-tag-electronic border border-gray-tag-electronic"}`}>{product.kategori}</a>
                                    </div>

                                </div>

                            </div>

                        </div>
                        ))}
                    </section>
                )}
            </article>

            <p className="font-poppins text-center mt-5 opacity-45 w-full py-2">Anda sudah melihat semua produk :D</p>
        </div>
    )
}

export default Dashboard;