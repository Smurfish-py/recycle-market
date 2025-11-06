import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { findAllProducts } from "../controllers/product.controller";
import Skeleton from "../components/Skeleton";

// Image
import errorPng from "../assets/images/error.png"

// Icons
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Object for controlling
    const tagColor = {
        BAGUS: "text-blue-tag-new border border-blue-tag-new",
        MENENGAH: "text-yellow-tag-mid border border-yellow-tag-mid",
        RUSAK: "text-red-tag-broken border border-red-tag-broken",
        ELEKTRONIK: "text-gray-tag-electronic border border-gray-tag-electronic",
        NON_ELEKTRONIK: "text-green-tag-noelectronic border-green-tag-noelectronic"
    }

    useEffect(() => {

        // Function for fetching all products (sorted desc)
        const fetchProducts = async () => {
            try {
                const response = await findAllProducts();
                const productData = await response.data;
                setProducts(productData);
            } catch (error) {
                console.log({ error: error });
                setError("Gagal terhubung ke backend :(");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Backend Error handling
    if (error) return (
        <div className="flex flex-col w-full mt-16 h-120 items-center justify-center font-inter text-center">
            <img src={errorPng} className="w-50 h-50 mb-8" />
            <h1 className="text-xl font-bold">{error}</h1>
            <p className="">Mohon maaf atas ketidaknyamanannya</p>
        </div>
    );

    // Function for repeating the skeleton for items
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

            {/* Main Content */}
            <article className="w-full flex flex-col gap-1 mt-2 md:mt-4">

                {/* Hero Section */}
                <section id="hero" className="sr-only font-inter text-center flex flex-col gap-4 lg:py-8 select-none min-[1280px]:not-sr-only">
                    <h3 className="text-xl">Kelompok 13</h3>
                    <h1 className="font-semibold text-8xl">RECYCLE MARKET</h1>
                    <h2 className="font-semibold text-2xl">Resell, Reuse, Recycle</h2>
                </section>

                {products.length < 1 ? (
                    <div className="h-15 flex flex-col justify-center">
                        <p className="text-center">Belum ada produk yang dijual nih...</p>
                    </div>
                ) : (
                    <>
                    {/* Newest Product */}
                        {loading ? (

                            // Skeleton
                            <div className="min-[480px]:max-sm:px-4 md:px-6 lg:px-4">
                                <div className={`card relative w-full h-35 cursor-pointer md:h-48 lg:h-80 lg:mt-8 bg-gray-200 animate-pulse`}></div>
                            </div>

                        ) : (
                            <div className="min-[480px]:max-sm:px-4 md:px-6 lg:px-4" onClick={() => navigate(`/product/${products[0]?.id}`)}>
                                <div className={`card relative w-full h-35 cursor-pointer bg-cover md:h-48 bg-position-[center_top_-5rem] lg:bg-position-[center_top_-10rem] lg:h-80 lg:mt-8`} style={{
                                    backgroundImage: products[0]?.fotoProduk?.[0]?.file != undefined ? `url(${API_URL}/api/images/products/${products[0]?.fotoProduk?.[0]?.file})` 
                                    : "none",
                                    backgroundColor: products[0]?.fotoProduk?.[0]?.file == undefined ? `#52B788` 
                                    : "none",
                                    
                                }}>
                                    <div className="card bg-black opacity-50 backdrop-invert-50 w-full"></div>
                                    {/* Container for Label and Price */}
                                    <div className="card absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-full flex flex-row px-4 z-10 py-2 text-white md:py-4 md:px-6 lg:py-10 lg:px-8">

                                        {/* Label side/Left side (Product name + seller) */}
                                        <section className="flex flex-1 flex-col justify-between font-medium min-[480px]:max-sm:text-3xl">

                                            {/* Label */}
                                            <h3 className="font-inter text-2xl md:text-3xl lg:text-5xl">Baru Saja Hadir!</h3>

                                            {/* Product name and seller */}
                                            <div className="font-poppins font-medium">
                                                <h4 className="text-sm min-[480px]:text-xl lg:text-3xl">{products[0]?.nama}</h4>
                                                <p className="font-light text-[10px] min-[480px]:text-sm lg:text-2xl">Oleh {products[0]?.toko?.nama}</p>
                                            </div>
                                        </section>

                                        {/* Label side/Roght side (Price) */}
                                        <section className="font-poppins flex flex-1 flex-col gap-1 justify-end items-end lg:gap-2">

                                            {/* Price */}
                                            <h3 className="font-medium text-xl sm:text-2xl md:text-4xl lg:text-6xl">{`Rp.${products[0]?.harga?.toLocaleString('id-ID')}`} <span className="text-xs sm:text-base md:text-xl lg:text-2xl">/{products[0]?.jenisHarga}</span></h3>

                                            {/* Tag */}
                                            <div className="flex gap-1 md:gap-2">
                                                <a href="" className={`text-[8px] border-1 py-0.5 px-1.5 sm:text-xs lg:text-sm rounded-full bg-transparent text-white`}>{products?.[0]?.kategori}</a>
                                                <a href="" className={`text-[8px] border-1 py-0.5 px-1.5 sm:text-xs lg:text-sm rounded-full bg-transparent text-white`}>{products?.[0]?.kualitas}</a>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                <div className="w-full flex justify-center mt-3 text-gray-400 text-xs sm:text-sm">
                                    <p>- Klik banner diatas untuk melihat produk terbaru -</p>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <hr className="text-stone-300 mt-3 md:my-3 mx-1 lg:my-3"/>

                        {/* Product Section */}
                        {loading ? (

                            // Skeleton
                            <section className="grid grid-cols-1 sm:justify-items-center sm:grid-cols-2 md:gap-y-5 lg:grid-cols-3 ">
                                {skeleton()}
                            </section>  

                        ) : (

                            // Products
                            <section className="grid grid-cols-1 sm:grid-cols-2 sm:justify-items-center md:gap-y-5 lg:grid-cols-3 select-none">

                            {/* Element Loop */}
                            {products.map((product, index) => (
                                
                                // Card
                                <div key={index} className="card items-center sm:max-md:w-full px-2 min-[480px]:max-[640px]:px-12 flex gap-2 sm:gap-0 md:flex-col md:items-start">

                                    {/* Product picture */}
                                    <div className="cursor-pointer sm:min-w-26 md:h-40 transition duration-300 hover:brightness-75 active:brightness-75" onClick={() => navigate(`/product/${product.id}`)}>
                                        {
                                        product.fotoProduk?.[0]?.file ? (
                                            
                                            <img src={`${API_URL}/api/images/products/${product.fotoProduk[0].file}`} className="size-26 rounded-md object-cover object-top md:w-80 md:h-40 sm:object-cover md:object-[25%_15%]" />
                                            
                                            
                                        ) : (
                                            <div className="size-26 rounded-md bg-gray-200 flex items-center justify-center text-xs text-center md:w-80 md:h-40">
                                                <p className="font-inter font-semibold text-gray-400">Tidak ada Foto</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="h-full py-3 flex flex-col gap-2 justify-center sm:px-2 sm:gap-4">

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
                                        <div className="flex flex-col gap-2">

                                            {/* Price */}
                                            <h3 className="font-inter font-semibold text-xl md:text-2xl">Rp. {product?.harga?.toLocaleString('id-ID')} <span className="text-sm">/{product.jenisHarga}</span></h3>

                                            {/* Tags */}
                                            <div className="flex flex-row gap-2">
                                                <a href="" className={`text-xs border-1 py-0.5 px-1.5 md:text-sm rounded-full ${tagColor[product.kategori]}`}>{product.kategori}</a>
                                                <a href="" className={`text-xs border-1 py-0.5 px-1.5 md:text-sm rounded-full ${tagColor[product.kualitas]}`}>{product.kualitas}</a>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                                ))}
                            </section>
                        )}
                    </>
                )}
            </article>

            <p className="font-poppins text-center mt-5 opacity-45 w-full py-2">Anda sudah melihat semua produk :D</p>
        </div>
    )
}

export default Dashboard;