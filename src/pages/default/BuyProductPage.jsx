import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { HandThumbUpIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

import placeholder from '@/assets/images/login-illustration.png';
import Header from '@/components/Header';

import { findProductId } from "@/controllers/product.controller";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

export default function BuyProductPage() {
    const API_URL = import.meta.env.VITE_API_URL;

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [ isCod, setIsCod ] = useState(true);
    const [ product, setProduct ] = useState(null);

    const quantity = parseInt(searchParams.get('quantity'));

    const biayaAdmin = 1500;

    useEffect(() => {
        const fetchProduct = async (id) => {
            const res = await findProductId(id);
            setProduct(res.data);
        }

        fetchProduct(id);
    }, []);

    function buyMethod(e) {
        if (e.target.value === 'COD') {
            setIsCod(true);
        } else {
            setIsCod(false);
        }
    }

    return (
        <div className="relative flex flex-col min-h-screen">
            <Header customHeader={true} title={"Detail Pembayaran"} />
            <main className="mt-12 grow md:mt-4">
                <form className="flex justify-center flex-col-reverse gap-2 md:flex-row md:px-12 md:py-16 md:gap-8">
                    <section className="md:border md:border-stone-400 h-fit flex-2/3 rounded-lg px-4 py-2">
                        <h2 className="text-2xl font-semibold mb-6">Informasi Pembayaran</h2>
                        <div className="flex flex-col gap-6 [&_section]:flex [&_section]:flex-col [&_section]:gap-2">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="nama">Nama Penerima</label>
                                <input id="nama" placeholder="John Doe" className="border w-full px-2 py-1 rounded-sm border-stone-300 ml-1" />
                            </div>
                            <div className="w-full flex flex-row gap-2">
                                <section className="flex-1 ">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" placeholder="john-doe@gmail.com" className="border w-full px-2 py-1 rounded-sm border-stone-300 ml-1" />
                                </section>
                                <section className="flex-1">
                                    <label htmlFor="noHp">Nomor Telepon</label>
                                    <input id="noHp" placeholder="081234567891" className="border w-full px-2 py-1 rounded-sm border-stone-300 ml-1" />
                                </section>
                            </div>
                            <div className="w-full flex flex-row gap-2">
                                <section className="flex-2/3">
                                    <label htmlFor="alamat">Alamat</label>
                                    <textarea id="alamat" placeholder="Jl. Sawit Selatan No.3 RT02/RW05, Kelurahan Akar, Kecamatan Kelapa, Kota Buah, Jawa Barat" className="border px-2 py-1 rounded-sm border-stone-300 ml-1 h-8 min-h-8"></textarea>
                                </section>
                                <section className="flex-1/3">
                                    <label htmlFor="kodePos">Kode Pos</label>
                                    <input id="kodePos" placeholder="10243" className="border w-full px-2 py-1 rounded-sm border-stone-300 ml-1" />
                                </section>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="deskripsi">Deskripsi</label>
                                <textarea id="deskripsi" placeholder="Tolong jangan dilempar, diinjak, atau dibanting karena berisi barang mudah pecah" className="border w-full px-2 py-1 rounded-sm border-stone-300 ml-1"></textarea>
                            </div>
                            <hr className="text-stone-400" />
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Metode Pembayaran</h2>
                                <section>
                                    <select className="bg-stone-300/80 px-4 py-2 rounded-sm cursor-pointer mb-3" name="jenisHarga" onChange={buyMethod} required>
                                        <option value="" disabled defaultValue="">-- Pilih Opsi --</option>
                                        <option value={"COD"}>Cash on Delivery (COD)</option>
                                        <option value={"E-wallet"}>E-wallet (QRIS)</option>
                                    </select>
                                    { isCod ? (
                                        <div className="bg-green-main-2/30 px-4 py-2 flex items-center gap-4 rounded-sm">
                                            <HandThumbUpIcon className="size-10 md:size-6" />
                                            <p>Dengan metode pembayaran COD, anda tidak perlu membayar biaya administrasi website!</p>
                                        </div>
                                    ) : "" }
                                    <button className="btn btn-solid w-full md:hidden">Bayar</button>
                                </section>
                            </div>
                        </div>
                    </section>
                    <section className="md:border md:border-stone-400 rounded-md h-fit flex-1/3 px-4 py-2">
                        <h2 className="text-2xl font-semibold mb-6">Barang Anda</h2>
                        <section className="flex gap-4 items-center">
                            {!product?.fotoProduk?.[0].file ? <div className="size-30 bg-stone-200 rounded-md"></div> : <img src={`${API_URL}/api/images/products/${product?.fotoProduk?.[0].file}`} className="size-30 object-cover aspect-square rounded-md" />}
                            <div>
                                <h3 className="text-xl">{product?.nama}</h3>
                                <section className="flex items-center gap-2">
                                    <BuildingStorefrontIcon className="size-4" />
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm">{product?.toko?.nama}</p>
                                        { product?.toko?.shopStatus === 'APPROVE' ? <CheckBadgeIcon className="size-4 text-green-main-2" /> : ""}
                                    </div>
                                    
                                </section>
                            </div>
                        </section>
                        <hr className="my-2 text-stone-400"/>
                        <section>
                            <div className="flex justify-between">
                                <p className="opacity-50">Harga satuan</p>
                                <p className="text-rose-400">Rp. {product?.harga.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="opacity-50">Jumlah</p>
                                <p className="text-rose-400">{quantity}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="opacity-50">Biaya admin</p>
                                <p className="text-rose-400">
                                    Rp. {isCod ? "0" : biayaAdmin.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="mt-8 flex justify-between">
                                <p className="font-semibold opacity-70">Total</p>
                                <p className="font-semibold text-rose-400">
                                    Rp. {isCod ? (product?.harga * quantity).toLocaleString('id-ID') : (product?.harga * quantity + biayaAdmin).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <hr className="my-2 text-stone-400"/>
                            <button className="btn btn-solid w-full hidden md:block">Bayar</button>
                        </section>
                    </section>
                </form>
            </main>
            {console.log(product)}
        </div>
    )
}