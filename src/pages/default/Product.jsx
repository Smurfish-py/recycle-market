import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { UserCircleIcon, UserIcon, BookmarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

import { findProductId } from "../../controllers/product.controller"

function Product() {
    const { id } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;

    const [product, setProduct] = useState([]);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(0);
    const [images, setImages] = useState([]);
    const [quantity, setQuantity] = useState(1);
    
    let productRating = 0;
    let overall;
    let average;

    product?.rating?.forEach((e) => {
        productRating += e.rating;  
    });

    if (product?.rating?.length < 1) {
        average = 0
    } else {
        average = productRating / product?.rating?.length;
    }
    
    if (average == 0) {
        overall = "Belum ada penilaian"
    }else if (average <= 1) {
        overall = "Luar Biasa Negatif";
    } else if (average <= 2) {
        overall = "Sangat Negatif";
    } else if (average <= 3) {
        overall = "Negatif";
    } else if (average <= 3.8) {
        overall = "Campuran";
    } else if (average <= 4.5) {
        overall = "Positif";
    } else {
        overall = "Luar Biasa Positif";
    }

    useEffect(() => {
        const fetchData = async (productId) => {
            try {
                const response = await findProductId(productId);
                const productData = response.data;
                setProduct(productData);
                setImages(productData?.fotoProduk);
            } catch (error) {
                console.error({ error: error });
                setError("Gagal mengambil data produk :(")
            }
        }

        fetchData(id);
    }, []);

    return (
        <>
            <div className="relative flex flex-col min-h-screen">
                <Header customHeader={true} title={"Detail Produk"} />
                <main className="mt-12 grow md:mt-4">
                    <div className="md:flex md:flex-row md:px-12 md:py-16 md:gap-24">
                        <section className="w-full flex flex-col gap-2 select-none md:w-110">
                            <div className="hidden lg:flex flex-row gap-3 font-poppins font-semibold my-3 text-xs pl-3">
                                <a className="text-stone-400 hover:text-neutral-800" href="/">BERANDA</a>
                                <p className="text-stone-400">/</p>
                                <a className="text-stone-400 hover:text-neutral-800" href={`/category/${product.kategori}`}>{product.kategori}</a>
                                <p className="text-stone-400">/</p>
                                <p>{product.nama?.toUpperCase()}</p>
                            </div>
                            {images.length < 1 ? (
                                <div className="h-80 w-full flex items-center justify-center font-poppins font-semibold bg-stone-300 text-stone-400 md:w-110 md:h-100">
                                    <p>Produk ini tidak memiliki foto</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="h-80 w-full overflow-hidden md:w-110">
                                        {images?.[selected]?.file && (
                                            <img src={`${API_URL}/api/images/products/${images?.[selected]?.file}`} className="h-full w-full object-cover object-top md:rounded-lg"/>
                                        )}
                                    </div> 
                                    <div className="flex flex-row px-4 mt-2 gap-3 w-full overflow-y-auto md:px-0">
                                        {images.map((image, index) => (
                                            <div key={index} className="border border-stone-400 rounded-md w-20 h-20 cursor-pointer transition duration-300 hover:brightness-75 active:brightness-75" onClick={() => {setSelected(index)}}>
                                                <img src={`${API_URL}/api/images/products/${image?.file}`} className="rounded-md h-full w-full object-cover"/>
                                            </div>
                                        ))} 
                                    </div>
                                </div>
                            )}
                        </section>
                        <section className="w-full select-none mt-4 px-4 md:mt-0 lg:mt-12">
                            <div className="py-4 md:pt-0">
                                <div className="flex flex-row gap-1 items-center py-1.5">
                                    <UserIcon className="size-4 text-stone-500 stroke-2"></UserIcon>
                                    <p className="font-poppins font-semibold text-xs text-stone-500 cursor-pointer active:underline hover:underline">{product?.toko?.nama}</p>
                                </div>
                                <h1 className="font-inter font-semibold text-3xl">{product.nama}</h1>
                                <p className="font-poppins font-normal text-xs text-stone-500 py-1.5">{product.deskripsi}</p>
                            </div>
                            <hr className="text-stone-300"/>
                            <div className="font-poppins py-6 flex flex-col gap-1">
                                <h1 className="font-semibold text-3xl">Rp. {product?.harga?.toLocaleString('id-ID')} <span className="text-xl">/{product.jenisHarga}</span></h1>
                                <p className="text-xs text-stone-500">{product.deskripsiHarga}</p>
                            </div>
                            <hr className="text-stone-200"/>
                            <div className="font-poppins py-6 flex flex-col gap-1">
                                <h2 className="font-poppins text-3xl font-semibold">Avg. Rating: {parseFloat(average.toFixed(2))}<span className="text-xl text-stone-400">/5</span></h2>
                                <p className="text-xs text-stone-500">{overall} {`(${product?.rating?.length} pengulas)`}</p>
                            </div>
                            <hr className="text-stone-200"/>
                            <div className="font-poppins py-6 flex flex-col gap-1">
                                <h2 className="font-bold text-2xl">Detail Produk</h2>
                                <p className="font-light text-sm">{product.detail}</p>
                            </div>
                            <hr className="text-stone-200"/>
                            <div className="font-poppins py-6 flex flex-col gap-1">
                                <h2 className="font-bold text-2xl mb-2">Rating & Ulasan</h2>
                                {product?.rating?.length < 1 ? (
                                    <p className="text-sm text-stone-400">Belum ada ulasan</p>
                                ) : (
                                    <div className="max-h-50 overflow-y-auto divide-y divide-gray-200">
                                        {product?.rating?.map((rating, index) => (
                                            <div key={index} className="flex flex-row gap-2 py-2 px-1.5">
                                                <div className="flex items-center">
                                                    <UserCircleIcon className="size-6"></UserCircleIcon>
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold">{product?.rating?.[index]?.user?.username}</h3>
                                                    <h4 className="text-sm font-semibold">Rating: {rating?.rating}<span className="text-stone-400">/5</span></h4>
                                                    <p className="text-sm">{product?.rating?.[index]?.komentar}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <hr className="text-stone-200"/>
                            <form className="font-poppins py-6 flex flex-col gap-4">
                                <div className="flex flex-row justify-between items-center">
                                    <p className="font-semibold">Stok: {product.stok > 100 ? "100+" : product.stok}</p>
                                    <div className="flex flex-rowjustify-between items-center px-2 h-8 rounded-sm bg-green-accent">
                                        <MinusIcon className="size-8 px-2 stroke-2 cursor-pointer" onClick={(e) => {
                                            e.preventDefault;
                                            setQuantity((prev) => Math.max(1, prev - 1));
                                        }}/>
                                        <input type="number" className="w-10 focus:outline-none text-center" value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                                        <PlusIcon className="size-8 px-2 stroke-2 cursor-pointer" onClick={(e) => {
                                            e.preventDefault;
                                            setQuantity(quantity + 1);
                                        }}/>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <button className="block border-2 flex-1/12 btn md:hidden">
                                        <BookmarkIcon className="size-4 stroke-2" />
                                    </button>
                                    <button className="border py-2 flex-11/12 md:flex-1/2 btn-solid cursor-pointer">Beli Sekarang</button>
                                    <button className="hidden py-2 border-2 md:flex justify-center md:flex-1/2 btn cursor-pointer">Simpan ke Markah</button>
                                </div>
                            </form>
                        </section>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}

export default Product;