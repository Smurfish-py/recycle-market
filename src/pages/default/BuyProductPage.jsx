import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HandThumbUpIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode"; 
import Header from '@/components/Header';

import { findProductId } from "@/controllers/product.controller";
import { userData } from "@/controllers/user.controller";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

export default function BuyProductPage() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem('token');
    
    const decodeToken = () => {
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch (e) {
            return null;
        }
    }
    
    const decode = decodeToken();

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [isCod, setIsCod] = useState(false); 
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);

    // --- TAMBAHAN: State untuk Form Pembeli ---
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        noHp: "",
        alamat: "",
        kodePos: "",
        deskripsi: ""
    });

    const quantity = parseInt(searchParams.get('quantity')) || 1;
    const biayaAdmin = 1500;

    useEffect(() => {
        const fetchProduct = async (id) => {
            const res = await findProductId(id);
            setProduct(res.data);
        }

        const fetchUser = async (id) => {
            const res = await userData(id);
            setUser(res?.data);

            if (res?.data) {
                setFormData(prev => ({
                    ...prev,
                    nama: res.data.fullname || "",
                    email: res.data.email || "",
                    noHp: res.data.noHp || "",
                    alamat: res.data.alamat || ""
                }));
            }
        }

        if (id) fetchProduct(id);
        if (decode?.id) fetchUser(decode?.id);
    }, [id]);

    function buyMethod(e) {
        setIsCod(e.target.value === 'COD');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault(); 
        const totalHarga = isCod ? (product?.harga * quantity) : (product?.harga * quantity + biayaAdmin);

        try {
            const response = await fetch(`${API_URL}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nama: formData.nama,
                    email: formData.email,
                    noHp: formData.noHp,
                    alamat: formData.alamat,
                    kodePos: formData.kodePos,
                    deskripsi: formData.deskripsi,
                    jenisHarga: isCod ? "COD" : "E-wallet",
                    productId: product.id, 
                    quantity: quantity,
                    userId: decode?.id
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal dari server");
            }

            if (isCod) {
                alert(`Pesanan COD berhasil! ID Pesanan: ${result.orderId}`);
                navigate('/pesanan');
                return;
            }

            window.snap.pay(result.token, {
                onSuccess: function (result) {
                    alert("Pembayaran sukses!");
                    navigate('/pesanan'); 
                },
                onPending: function (result) {
                    alert("Silakan selesaikan pembayaran Anda!");
                    navigate('/pesanan'); 
                },
                onError: function (result) {
                    alert("Pembayaran gagal!");
                },
                onClose: async function () {
                    try {
                        await fetch(`${API_URL}/api/checkout/cancel/${result.orderId}`, {
                            method: 'DELETE'
                        });
                        alert('Anda membatalkan pembayaran. Transaksi dihapus.');
                    } catch (err) {
                        console.error("Gagal menghapus transaksi", err);
                    }
                }
            });

        } catch (error) {
            console.error("Gagal memproses pembayaran:", error);
            alert("Terjadi kesalahan: " + error.message);
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen">
            <Header customHeader={true} title={"Detail Pembayaran"} />
            <main className="grow md:mt-4">
                <div className="px-4 md:px-14 mt-16 text-2xl font-semibold mb-6 flex flex-col text-center">
                    Informasi Pembayaran
                    <span className="text-sm font-normal text-gray-400/90">Lengkapi data berikut untuk memproses pembayaran anda</span>
                </div>
                <form onSubmit={handlePayment} className="flex justify-center flex-col-reverse gap-2 md:flex-row md:px-12 md:pb-12 md:gap-8">
                    <section className="md:border md:border-gray-200 h-fit flex-2/3 rounded-lg p-4 lg:p-6">
                        <input type="hidden" defaultValue={id} name="productId" />
                        <div className="flex flex-col gap-6 [&_section]:flex [&_section]:flex-col [&_section]:gap-2">
                            
                            <div className="flex flex-col gap-2">
                                <label htmlFor="nama" className="font-semibold">Nama Penerima</label>
                                <input 
                                    id="nama" 
                                    name="nama" 
                                    required 
                                    placeholder="John Doe"
                                    className={`border w-full px-2 py-1 rounded-sm border-stone-200 ml-1 ${user?.fullname ? "bg-stone-200 cursor-not-allowed text-stone-400" : ""}`} 
                                    disabled={!!user?.fullname} 
                                    value={formData.nama} // Menggunakan value, bukan defaultValue
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="w-full flex flex-row gap-2">
                                <section className="flex-1 ">
                                    <label htmlFor="email" className="font-semibold">Email</label>
                                    <input 
                                        id="email" 
                                        name="email"
                                        type="email" 
                                        required
                                        placeholder="john-doe@gmail.com"
                                        className={`border w-full px-2 py-1 rounded-sm border-stone-200 ml-1 ${user?.email ? "bg-stone-200 cursor-not-allowed text-stone-400" : ""}`}
                                        disabled={!!user?.email}
                                        value={formData.email} 
                                        onChange={handleChange}
                                    />
                                </section>
                                <section className="flex-1">
                                    <label htmlFor="noHp" className="font-semibold">Nomor Telepon</label>
                                    <input
                                        id="noHp" 
                                        name="noHp" 
                                        type="tel"
                                        required 
                                        placeholder="081234567891"
                                        className={`border w-full px-2 py-1 rounded-sm border-stone-300 ml-1 ${user?.noHp ? "bg-stone-200 cursor-not-allowed text-stone-400" : ""}`}
                                        disabled={!!user?.noHp}
                                        value={formData.noHp} 
                                        onChange={handleChange}
                                    />
                                </section>
                            </div>
                            
                            <div className="w-full flex flex-row gap-2">
                                <section className="flex-2/3">
                                    <label htmlFor="alamat" className="font-semibold">Alamat</label>
                                    <textarea
                                        id="alamat"
                                        name="alamat"
                                        required 
                                        placeholder="Jl. Sawit Selatan No.3..."
                                        className={`border px-2 py-1 rounded-sm border-stone-300 ml-1 h-8 min-h-8 ${user?.alamat ? "bg-stone-200 cursor-not-allowed text-stone-400" : ""}`}
                                        disabled={!!user?.alamat}
                                        value={formData.alamat} 
                                        onChange={handleChange}
                                    />
                                </section>
                                <section className="flex-1/3">
                                    <label htmlFor="kodePos" className="font-semibold">Kode Pos</label>
                                    <input 
                                        id="kodePos" 
                                        name="kodePos" 
                                        required 
                                        placeholder="10243" 
                                        className="border w-full px-2 py-1 rounded-sm border-stone-300 ml-1" 
                                        value={formData.kodePos}
                                        onChange={handleChange}
                                    />
                                </section>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label htmlFor="deskripsi" className="font-semibold">Deskripsi</label>
                                <textarea 
                                    id="deskripsi" 
                                    name="deskripsi" 
                                    placeholder="Tolong jangan dilempar..." 
                                    className="border w-full px-2 py-1 rounded-sm border-stone-300 ml-1"
                                    value={formData.deskripsi}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <hr className="text-gray-300" />
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Metode Pembayaran</h2>
                                <section>
                                    <select className="bg-stone-300/80 px-4 py-2 rounded-sm cursor-pointer mb-3" name="jenisHarga" onChange={buyMethod} required defaultValue={"E-wallet"}>
                                        <option value="" disabled>-- Pilih Opsi --</option>
                                        <option value={"COD"}>Cash on Delivery (COD)</option>
                                        <option value={"E-wallet"}>E-wallet (QRIS)</option>
                                    </select>
                                    {isCod && (
                                        <div className="bg-green-main-2/30 px-4 py-2 flex items-center gap-4 rounded-sm">
                                            <HandThumbUpIcon className="size-10 md:size-6" />
                                            <p>Dengan metode pembayaran COD, anda tidak perlu membayar biaya administrasi website!</p>
                                        </div>
                                    )}
                                    <button type="submit" className="btn btn-solid w-full md:hidden">Bayar</button>
                                </section>
                            </div>
                        </div>
                    </section>

                    <section className="md:border md:border-gray-200 rounded-md min-h-full flex-1/3 p-4 lg:p-6">
                        <h2 className="text-2xl font-semibold mb-6">Barang Anda</h2>
                        <section className="flex gap-4 items-center">
                            {!product?.fotoProduk?.[0].file ? 
                                <div className="size-30 bg-stone-200 rounded-md"></div> : 
                                <img src={`${API_URL}/api/images/products/${product?.fotoProduk?.[0].file}`} className="size-30 object-cover aspect-square rounded-md" />
                            }
                            <div>
                                <h3 className="text-xl">{product?.nama}</h3>
                                <section className="flex items-center gap-2">
                                    <BuildingStorefrontIcon className="size-4" />
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm">{product?.toko?.nama}</p>
                                        {product?.toko?.shopStatus === 'APPROVE' && <CheckBadgeIcon className="size-4 text-green-main-2" />}
                                    </div>
                                </section>
                            </div>
                        </section>
                        <hr className="my-6 text-gray-300" />
                        <section>
                            <div className="flex justify-between">
                                <p className="opacity-50">Harga satuan</p>
                                <p className="text-rose-400">Rp. {product?.harga?.toLocaleString('id-ID')}</p>
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
                                    Rp. {isCod ? (product?.harga * quantity)?.toLocaleString('id-ID') : (product?.harga * quantity + biayaAdmin)?.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <hr className="mt-6 lg:my-6 text-gray-300" />
                        </section>
                        <button type="submit" className="btn btn-solid w-full hidden md:block hover:brightness-90 active:brightness-90 mt-20">Bayar</button>
                    </section>
                </form>
            </main>
        </div>
    )
}