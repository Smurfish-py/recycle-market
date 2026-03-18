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
    
    // --- PERUBAHAN: State isCod diganti agar mendukung 3 metode ---
    const [paymentMethod, setPaymentMethod] = useState("E-wallet"); 
    
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);

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

    // Deteksi apakah bebas biaya admin (COD & Barter gratis admin)
    const isBebasAdmin = paymentMethod === 'COD' || paymentMethod === 'Barter';

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
        setPaymentMethod(e.target.value);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault(); 

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
                    jenisHarga: paymentMethod, // Kirimkan value asli: COD, E-wallet, atau Barter
                    productId: product.id, 
                    quantity: quantity,
                    userId: decode?.id
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal dari server");
            }

            // Jika COD atau Barter, langsung sukses tanpa buka popup Midtrans
            if (isBebasAdmin) {
                alert(`Pesanan ${paymentMethod} berhasil! ID Pesanan: ${result.orderId}`);
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
        <div className="relative flex flex-col min-h-screen font-inter">
            <Header customHeader={true} title={"Detail Pembayaran"} />
            <main className="grow md:mt-4">
                <div className="px-4 md:px-14 mt-16 text-2xl font-semibold mb-6 flex flex-col text-center">
                    Informasi Pembayaran
                    <span className="text-sm font-normal text-gray-400/90">Lengkapi data berikut untuk memproses pesanan Anda</span>
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
                                    className={`border w-full px-3 py-2 text-sm rounded-md border-stone-200 ${user?.fullname ? "bg-stone-100 cursor-not-allowed text-stone-500" : ""}`} 
                                    disabled={!!user?.fullname} 
                                    value={formData.nama}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="w-full flex flex-col md:flex-row gap-4">
                                <section className="flex-1">
                                    <label htmlFor="email" className="font-semibold">Email</label>
                                    <input 
                                        id="email" 
                                        name="email"
                                        type="email" 
                                        required
                                        placeholder="john-doe@gmail.com"
                                        className={`border w-full px-3 py-2 text-sm rounded-md border-stone-200 ${user?.email ? "bg-stone-100 cursor-not-allowed text-stone-500" : ""}`}
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
                                        className={`border w-full px-3 py-2 text-sm rounded-md border-stone-200 ${user?.noHp ? "bg-stone-100 cursor-not-allowed text-stone-500" : ""}`}
                                        disabled={!!user?.noHp}
                                        value={formData.noHp} 
                                        onChange={handleChange}
                                    />
                                </section>
                            </div>
                            
                            <div className="w-full flex flex-col md:flex-row gap-4">
                                <section className="flex-2/3 w-full">
                                    <label htmlFor="alamat" className="font-semibold">Alamat</label>
                                    <textarea
                                        id="alamat"
                                        name="alamat"
                                        required 
                                        placeholder="Jl. Sawit Selatan No.3..."
                                        className={`border w-full px-3 py-2 text-sm rounded-md border-stone-200 min-h-[42px] ${user?.alamat ? "bg-stone-100 cursor-not-allowed text-stone-500" : ""}`}
                                        disabled={!!user?.alamat}
                                        value={formData.alamat} 
                                        onChange={handleChange}
                                    />
                                </section>
                                <section className="flex-1/3 w-full">
                                    <label htmlFor="kodePos" className="font-semibold">Kode Pos</label>
                                    <input 
                                        id="kodePos" 
                                        name="kodePos" 
                                        required 
                                        placeholder="10243" 
                                        className="border w-full px-3 py-2 text-sm rounded-md border-stone-200" 
                                        value={formData.kodePos}
                                        onChange={handleChange}
                                    />
                                </section>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label htmlFor="deskripsi" className="font-semibold">Deskripsi Pesanan (Opsional)</label>
                                <textarea 
                                    id="deskripsi" 
                                    name="deskripsi" 
                                    placeholder="Catatan tambahan untuk penjual..." 
                                    className="border w-full px-3 py-2 text-sm rounded-md border-stone-200 min-h-[80px]"
                                    value={formData.deskripsi}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <hr className="text-gray-200" />
                            <div>
                                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-stone-800">Metode Pembayaran</h2>
                                <section>
                                    <select 
                                        className="bg-stone-100 border border-stone-200 text-stone-800 text-sm font-medium px-4 py-2.5 rounded-md cursor-pointer mb-3 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-green-main-2" 
                                        name="jenisHarga" 
                                        onChange={buyMethod} 
                                        required 
                                        defaultValue={"E-wallet"}
                                    >
                                        <option value="" disabled>-- Pilih Opsi Pembayaran --</option>
                                        <option value={"E-wallet"}>E-wallet (QRIS / Transfer)</option>
                                        <option value={"COD"}>Cash on Delivery (Bayar di Tempat)</option>
                                        <option value={"Barter"}>Barter (Tukar Tambah / Tukar Barang)</option>
                                    </select>

                                    {/* Info Khusus COD */}
                                    {paymentMethod === 'COD' && (
                                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 flex items-start gap-3 rounded-md mb-4 shadow-sm">
                                            <HandThumbUpIcon className="w-6 h-6 shrink-0 text-green-600 mt-0.5" />
                                            <p className="text-sm leading-relaxed">Dengan metode pembayaran COD, Anda tidak perlu membayar biaya administrasi website!</p>
                                        </div>
                                    )}

                                    {/* Info Khusus BARTER */}
                                    {paymentMethod === 'Barter' && (
                                        <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-3 flex items-start gap-3 rounded-md mb-4 shadow-sm">
                                            <BuildingStorefrontIcon className="w-6 h-6 shrink-0 text-purple-600 mt-0.5" />
                                            <p className="text-sm leading-relaxed">Anda memilih opsi <b>Barter</b>. Tidak ada biaya yang ditagihkan. Pastikan Anda menghubungi penjual via chat/kontak setelah pesanan dibuat untuk berdiskusi mengenai barang yang akan ditukar!</p>
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-solid w-full md:hidden mt-2 py-3 rounded-md text-sm font-semibold">Buat Pesanan</button>
                                </section>
                            </div>
                        </div>
                    </section>

                    {/* --- RINGKASAN BARANG --- */}
                    <section className="md:border md:border-gray-200 rounded-lg h-fit flex-1/3 p-4 lg:p-6 bg-stone-50 md:bg-white shadow-sm md:shadow-none mb-6 md:mb-0">
                        <h2 className="text-xl font-semibold mb-6 text-stone-800">Ringkasan Belanja</h2>
                        <section className="flex gap-4 items-center">
                            {!product?.fotoProduk?.[0].file ? 
                                <div className="w-20 h-20 bg-stone-200 rounded-md shrink-0"></div> : 
                                <img src={`${API_URL}/api/images/products/${product?.fotoProduk?.[0].file}`} className="w-20 h-20 object-cover aspect-square rounded-md shrink-0 border border-stone-200" />
                            }
                            <div>
                                <h3 className="text-base font-semibold text-stone-800 leading-tight line-clamp-2">{product?.nama}</h3>
                                <section className="flex items-center gap-1.5 mt-2">
                                    <BuildingStorefrontIcon className="w-4 h-4 text-stone-400" />
                                    <div className="flex items-center gap-1">
                                        <p className="text-xs text-stone-600 font-medium">{product?.toko?.nama}</p>
                                        {product?.toko?.shopStatus === 'APPROVE' && <CheckBadgeIcon className="w-4 h-4 text-green-main-2" title="Toko Terverifikasi" />}
                                    </div>
                                </section>
                            </div>
                        </section>
                        <hr className="my-5 text-gray-200" />
                        <section className="text-sm">
                            <div className="flex justify-between mb-3">
                                <p className="text-stone-500">Harga satuan</p>
                                <p className="font-semibold text-stone-700">Rp {product?.harga?.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex justify-between mb-3">
                                <p className="text-stone-500">Jumlah</p>
                                <p className="font-semibold text-stone-700">{quantity} Barang</p>
                            </div>
                            <div className="flex justify-between mb-5">
                                <p className="text-stone-500">Biaya admin</p>
                                <p className="font-semibold text-stone-700">
                                    {isBebasAdmin ? (
                                        <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">Gratis</span>
                                    ) : (
                                        `Rp ${biayaAdmin.toLocaleString('id-ID')}`
                                    )}
                                </p>
                            </div>
                            
                            <hr className="border-dashed border-stone-300 mb-4" />
                            
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-stone-800">Total Tagihan</p>
                                <p className="font-bold text-lg text-green-700">
                                    Rp {isBebasAdmin ? (product?.harga * quantity)?.toLocaleString('id-ID') : (product?.harga * quantity + biayaAdmin)?.toLocaleString('id-ID')}
                                </p>
                            </div>
                            
                        </section>
                        <button type="submit" className="bg-green-main-2 hover:bg-green-700 text-white w-full hidden md:block mt-8 py-3 rounded-md transition-colors font-semibold shadow-sm">
                            Buat Pesanan
                        </button>
                    </section>
                </form>
            </main>
        </div>
    )
}