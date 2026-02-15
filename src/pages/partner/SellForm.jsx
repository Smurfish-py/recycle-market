import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import { addProduct } from "@/controllers/product.controller";
import { useNavigate } from "react-router-dom";

export default function SellForm() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const token = localStorage.getItem('token');
    const decode = jwtDecode(token);

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { id, nama, deskripsi, harga, jenisHarga, deskripsiHarga, detailProduk, stok, kategori, kualitas } = e.target;

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('photoProduct', files[i]);
        }

        formData.append('id', id.value);
        formData.append('nama', nama.value);
        formData.append('deskripsi', deskripsi.value);
        formData.append('harga', harga.value);
        formData.append('jenisHarga', jenisHarga.value);
        formData.append('deskripsiHarga', deskripsiHarga.value);
        formData.append('detailProduk', detailProduk.value);
        formData.append('stok', stok.value);
        formData.append('kategori', kategori.value);
        formData.append('kualitas', kualitas.value);

        try {
            const sellProduct = async (data) => {
                const res = await addProduct(data);
                alert(res.message);
                return res;
            }

            await sellProduct(formData);
        } catch (error) {
            console.log(error.data);
        } finally {
            navigate(`/shop/${id?.value}`);
        }
    }

    useEffect(() => {
        
    }, []);

    return (
        <div className="mt-16 flex justify-center">
            <div className="lg:w-1/2 py-2 px-4 border border-stone-300 rounded-lg">
                <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
                    <h1 className="font-inter font-semibold text-2xl">FORM PENGAJUAN PRODUK</h1>
                    <p>Admin akan meninjau produk anda sebelum menjualnya kedalam website</p>
                    <hr className="my-4 text-stone-300" />
                    <div>
                        <input type="hidden" defaultValue={decode?.idToko} name="id" />
                        <label htmlFor="nama">Nama Produk</label>
                        <input name="nama" className="input-text w-full mb-3" placeholder="Contoh: Baju tak Terpakai" maxLength="30" required />
                        <label htmlFor="deskripsi">Deskripsi Singkat</label><br />
                        <textarea id="deskripsi" className="w-full input-text" name="deskripsi" placeholder="Contoh: Baju bekas dengan berbagai warna menarik" maxLength={255} required /><br />
                        <div className="flex flex-row gap-2">
                            <div className="flex-8/9">
                                <label htmlFor="harga">Harga</label>
                                <input type="number" name="harga" className="input-text w-full mb-3" placeholder="Contoh: 100000" required/>
                            </div>
                            <div className="flex-1/9">
                                <label htmlFor="harga">Jenis Harga</label><br />
                                <select className="btn-solid cursor-pointer mb-3" name="jenisHarga" required>
                                    <option value="" disabled defaultValue="">-- Pilih Opsi --</option>
                                    <option value={"PCS"}>/PCS</option>
                                    <option value={"LUSIN"}>/LUSIN</option>
                                    <option value={"PAKET"}>/PAKET</option>
                                </select> <br />
                            </div>
                        </div>
                        <label htmlFor="harga">Deskripsi Harga</label><br />
                        <input className="input-text w-full mb-3" placeholder="Contoh: Harga sudah termasuk pajak 5%" name="deskripsiHarga" maxLength={30} required />
                        <label htmlFor="harga">Detail Produk</label><br />
                        <textarea className="input-text w-full" placeholder="Contoh: Produk ini memiliki banyak jenis warna. Warna merah, biru, dan jingga." name="detailProduk" required />
                        <label htmlFor="harga">Stok Barang</label><br />
                        <input className="input-text w-16 mb-3" placeholder="cth: 6" name="stok" required /> <br />
                        <div className="flex flex-row gap-2 items-center mb-4">
                            <div className="flex">
                                <label htmlFor="file" className="btn cursor-pointer flex gap-2 w-fit" required >
                                    <CloudArrowUpIcon className="size-6 stroke-2" />
                                    Upload Gambar
                                </label>
                                <input type="file" className="btn sr-only" id="file" name="productPhoto" accept="image/*" onChange={handleFileChange} multiple required />
                            </div>
                            <div className="flex-1 text-stone-400">
                                <p>Bisa upload lebih dari 1 foto</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="harga">Kategori Barang</label><br />
                                <select className="btn-solid cursor-pointer mb-3 md:w-full" name="kategori" required>
                                    <option value="" disabled defaultValue="">-- Pilih Opsi --</option>
                                    <option value={"ELEKTRONIK"}>ELEKTRONIK</option>
                                    <option value={"NON_ELEKTRONIK"}>NON ELEKTRONIK</option>
                                </select> <br />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="harga">Kualitas Barang</label><br />
                                <select className="btn-solid cursor-pointer mb-3 md:w-full" name="kualitas" required>
                                    <option value="" disabled defaultValue="">-- Pilih Opsi --</option>
                                    <option value={"BAGUS"}>BAGUS</option>
                                    <option value={"MENENGAH"}>MENENGAH</option>
                                    <option value={"RUSAK"}>RUSAK</option>
                                </select> <br />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn-solid cursor-pointer">JUAL PRODUK</button>
                </form>
            </div>
        </div>
    )
}