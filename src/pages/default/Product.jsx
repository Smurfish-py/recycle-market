import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserCircleIcon, BuildingStorefrontIcon, BookmarkIcon as BookmarkOutline, PlusIcon, MinusIcon, XMarkIcon, StarIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { findProductId, checkBookmark, removeBookMark, addToBookMark, postRating, deleteRating } from "@/controllers/product.controller";
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
    const [marked, setMarked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
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

    // LOGIKA BARU: Mengecek apakah user login sudah berkomentar di produk ini
    const userHasRated = product?.rating?.some(
        (ulasan) => ulasan.idUser === decode?.id || ulasan.user?.id === decode?.id
    );

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

    async function handleMarked(e) {
        e.preventDefault();
        const product = await findProductId(id);
        const shopData = await findShopData(product?.data?.idToko);

        if (marked) {
            const res = await removeBookMark(decode?.id, id, shopData.id);
            setMarked(false);
            alert(res?.msg);
        } else {
            const res = await addToBookMark(decode?.id, id, shopData.id);
            setMarked(true);
            alert(res?.msg);
        }
    }

    async function handleRating(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const dataKirim = {
            rating: Number(formData.get('rating')),
            komentar: formData.get('komentar')
        };

        if (!dataKirim.rating) {
            alert("Silakan pilih bintang terlebih dahulu!");
            return; 
        }

        try {
            const res = await postRating(id, decode?.id, dataKirim);       
            alert("Ulasan berhasil dikirim!");
            setIsModalOpen(false);
            window.location.reload();

        } catch (error) {
            console.error("Gagal mengirim ulasan:", error);
            alert("Terjadi kesalahan saat mengirim ulasan.");
        }
    }

    async function handleDeleteRating(idUser) {
        try {
            if (confirm("Apakah anda yakin ingin menghapus ulasan mengenai produk ini?")) {
                const res = await deleteRating(id, idUser); 
            }
            window.location.reload();
        } catch (error) {
            console.error("Gagal menghapus ulasan");
        }
    }

    function starRating() {
        const ratingOptions = [1, 2, 3, 4, 5];

        return ratingOptions.map((ratingValue) => (
            <div key={ratingValue} className="flex flex-row items-center mb-2">
                <input type="radio" name="rating" id={`rating-${ratingValue}`} value={ratingValue} />
                <label htmlFor={`rating-${ratingValue}`} className="flex flex-row ml-2 cursor-pointer">
                    <span className="inline-flex items-center text-yellow-400">
                        {[...Array(5)].map((_, starIndex) => {
                            if (starIndex < ratingValue) {
                                return <StarIconSolid key={starIndex} className="size-5" />;
                            }
                            return <StarIcon key={starIndex} className="size-5 text-stone-300" />;
                        })}
                        
                    </span>
                    <span className="ml-2 text-sm text-stone-600 font-medium">
                        {ratingValue} Bintang
                    </span>
                </label>
            </div>
        ));
    }

    return (
        <>
            <div className="relative flex flex-col min-h-screen">
                <Header customHeader={true} title={"Detail Produk"} />
                <main className="mt-12 grow md:mt-4">
                    <div className="md:flex md:flex-row md:px-12 md:py-16 md:gap-12">
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
                                            <div key={index} className="border border-stone-400 rounded-md w-20 h-20 cursor-pointer transition duration-300 hover:brightness-75 active:brightness-75 touch-manipulation" onClick={() => {setSelected(index)}}>
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
                                <h2 className="font-poppins text-3xl font-semibold">Rating: {parseFloat(average.toFixed(2))}<span className="text-xl text-stone-400">/5</span></h2>
                                <p className="text-xs text-stone-500">{overall} {`(${product?.rating?.length || 0} pengulas)`}</p>
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
                                                <div className="flex items-center shrink-0">
                                                    {product?.rating?.[index]?.user?.profilePfp == null ? (
                                                        <UserCircleIcon className="size-10"></UserCircleIcon>
                                                    ) : (
                                                        <img src={`${API_URL}/api/images/users/${product?.rating?.[index]?.user?.profilePfp }`} className='size-10 border border-zinc-600 rounded-full aspect-square object-cover object-center' />
                                                    )}
                                                    
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
                                
                                {!isLoggedIn || product?.status !== "LOLOS" ? (
                                    <button className="btn-solid mt-4 w-full border-none font-normal cursor-not-allowed bg-zinc-300 text-zinc-500/70 py-2" onClick={(e) => e.preventDefault()}>Barang belum terverifikasi atau anda belum login</button>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={() => { !userHasRated ? setIsModalOpen(true) : handleDeleteRating(decode?.id) }} 
                                        className={`btn ${!userHasRated ? "" : "text-red-500 border-red-400"} w-full mt-4 text-center font-inter cursor-pointer`}
                                    >
                                        {!userHasRated ? "Berikan komentar & rating" : "Hapus ulasan anda"}
                                    </button>
                                )}
                            </div>
                            <hr className="text-stone-200"/>
                            <div className="font-poppins py-6 flex flex-col gap-4">
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
                                            e.preventDefault();
                                            setQuantity((prev) => Math.min(product.stok, prev + 1));
                                        }}/>
                                    </div>
                                </div>

                                { !isLoggedIn || product?.status !== "LOLOS" ? (
                                    <div className="flex flex-row gap-2">
                                        <button className="btn-solid w-full border-none font-normal cursor-not-allowed bg-zinc-300 text-zinc-500/70 py-2" onClick={(e) => e.preventDefault()}>Barang belum terverifikasi atau anda belum login</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-row justify-between gap-2">
                                        <button className="flex justify-center items-center border-2 flex-1/12 btn md:hidden" onClick={(e) => handleMarked(e)}>
                                            {marked ? (
                                                <BookmarkSolid className="size-6 stroke-2" />
                                            ) : (
                                                <BookmarkOutline className="size-6 stroke-2" />
                                            )}
                                            
                                        </button>
                                        <a className="border py-2 flex-11/12 md:flex-1/2 btn-solid cursor-pointer text-center hover:brightness-90 active:brightness-90" href={`/buy/${id}?quantity=${quantity}`}>Beli Sekarang</a>
                                        <section className="hidden md:block md:flex-1/2">
                                            <input type="hidden" value={id} name="idProduk" />
                                            <input type="hidden" value={decode?.id} name="idUser" />
                                            <button className={`${ marked ? "btn-solid" : "btn" } py-2 w-full border-2 md:flex justify-center cursor-pointer`} onClick={(e) => handleMarked(e)}>
                                                {marked ? "Disimpan di Markah" : "Simpan ke Markah"}
                                            </button> 
                                        </section>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
                <Footer />
                {isModalOpen && (
                    <form className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity" onSubmit={ handleRating }>
                        <input type="hidden" />
                        <div className="bg-white w-full max-w-lg rounded-xl shadow-xl flex flex-col overflow-auto">
                            <div className="flex justify-between items-center p-5 border-b border-stone-200">
                                <h3 className="font-medium text-xl font-inter text-stone-800">Beri Penilaian</h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full p-1.5 transition-colors"
                                    title="Tutup"
                                    type="button"
                                >
                                    <XMarkIcon className="w-5 h-5 stroke-2" />
                                </button>
                            </div>

                            <div className="p-6 min-h-[250px] grid grid-cols-1 gap-2 bg-stone-50/50">
                                <section>
                                    <h2 className="font-inter font-medium text-lg">Rating secara keseluruhan</h2>
                                    {starRating()}
                                </section>
                                <div>
                                    <label className="font-inter font-medium text-lg">Komentar</label> <br />
                                    <textarea className="input-text w-full h-full" name="komentar"></textarea>
                                </div>
                            </div>

                            <div className="mt-4 p-5 border-t border-stone-200 flex justify-end gap-3 bg-white">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-5 py-2 font-semibold text-stone-600 bg-white border border-stone-300 rounded-md hover:bg-stone-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-solid px-6 py-2 hover:brightness-95 active:brightness-95"
                                >
                                    Kirim Ulasan
                                </button>
                            </div>
                        </div>
                    </form>
                )}

            </div>
        </>
    )
}

export default Product;