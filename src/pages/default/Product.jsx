import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { UserCircleIcon, BuildingStorefrontIcon, BookmarkIcon as BookmarkOutline, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

import { findProductId, checkBookmark, removeBookMark, addToBookMark } from "@/controllers/product.controller";
import { findShopData } from "@/controllers/shop.controller";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import isTokenExpired from '@/service/isTokenExpired';

function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode(token) : null;

    const [product, setProduct] = useState([]);
    const [shop, setShop] = useState([]);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(0);
    const [images, setImages] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [ marked, setMarked ] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
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
    
    async function handleMarked(e) {
        e.preventDefault();

        if (marked) {
            const res = await removeBookMark(decode?.id, id);
            setMarked(false);
            alert(res?.msg);
        } else {
            const res = await addToBookMark(decode?.id, id);
            setMarked(true);
            alert(res?.msg);
        }
    }

    useEffect(() => {
        if (token != null && !isTokenExpired(token)) setIsLoggedIn(true);

        const fetchShopData = async (shopId) => {
            try {
                const response = await findShopData(shopId);
                setShop(response);
            } catch (error) {
                console.error({ error: error });
            }
        }

        const fetchData = async (productId) => {
            try {
                const response = await findProductId(productId);
                const productData = response.data;

                await fetchShopData(productData?.idToko);

                setProduct(productData);
                setImages(productData?.fotoProduk);
            } catch (error) {
                console.error({ error: error });
                setError("Gagal mengambil data produk :(")
            }
        }

        const checkMarked = async (idUser, idProduct) => {
            try {
                const response = await checkBookmark(idUser, idProduct);
                response < 1 ? setMarked(false) : setMarked(true);
            } catch (error) {
                console.error({error: error});
            }
        }

        fetchData(id);

        if (decode?.id) {
            checkMarked(decode?.id, id);
        }
    }, [id]);

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
                                            <img src={`${API_URL}/api/images/products/${images?.[selected]?.file}`} className="h-full w-full object-cover object-center md:rounded-lg"/>
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
                                <div className="flex flex-row gap-1 items-center py-1.5 text-stone-500 ">
                                    <BuildingStorefrontIcon className="size-4 stroke-2"></BuildingStorefrontIcon>

                                    <a className="font-poppins font-semibold text-xs cursor-pointer active:underline hover:underline" onClick={() => navigate(`/shop/${product?.idToko}`)}>
                                        {product?.toko?.nama}
                                    </a>

                                    {shop?.shopStatus == 'APPROVE' && (
                                        <CheckBadgeIcon className="size-4" />
                                    )}
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
                                            e.preventDefault();
                                            setQuantity((prev) => Math.max(1, prev - 1));
                                        }}/>

                                        <input type="number" className="w-10 focus:outline-none text-center" value={quantity} onChange={(e) => {
                                            const val = e.target.value;
                                            if (val >= 1 && val <= 6) {
                                                setQuantity(val);
                                            }
                                        }}/>

                                        <PlusIcon className="size-8 px-2 stroke-2 cursor-pointer" onClick={(e) => {
                                            e.preventDefault;
                                            setQuantity((prev) => Math.min(product.stok, prev + 1));
                                        }}/>
                                    </div>
                                </div>

                                { !isLoggedIn ? (
                                    <div className="flex flex-row gap-2">
                                        <button className="btn-solid w-full border-none font-normal cursor-not-allowed bg-zinc-300 text-zinc-500/70 py-2">Anda harus login untuk membeli barang</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-row gap-2">
                                        <button className="block border-2 flex-1/12 btn md:hidden" onClick={(e) => handleMarked(e)}>
                                            {marked ? (
                                                <BookmarkSolid className="size-4 stroke-2" />
                                            ) : (
                                                <BookmarkOutline className="size-4 stroke-2" />
                                            )}
                                            
                                        </button>
                                        <button className="border py-2 flex-11/12 md:flex-1/2 btn-solid cursor-pointer">Beli Sekarang</button>
                                        <section className="md:flex-1/2">
                                            <input type="hidden" value={id} name="idProduk" />
                                            <input type="hidden" value={decode?.id} name="idUser" />
                                            <button className={`hidden ${ marked ? "btn-solid" : "btn" } py-2 w-full border-2 md:flex justify-center cursor-pointer`} onClick={(e) => handleMarked(e)}>
                                                {marked ? "Disimpan di Markah" : "Simpan ke Markah"}
                                            </button> 
                                        </section>
                                    </div>
                                )}
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