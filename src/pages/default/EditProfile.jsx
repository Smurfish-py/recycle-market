import Footer from "@/components/Footer";
import Header from "@/components/Header";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import isTokenExpired from "@/service/isTokenExpired";
import { userData, updateUser } from "@/controllers/user.controller";

import { ArrowUpTrayIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProfile() {
    const [ user, setUser ] = useState({}); // Diubah ke objek kosong karena data user adalah objek
    const [ file, setFile ] = useState(null);
    const [ preview, setPreview ] = useState(null); // State untuk pratinjau gambar
    const [ isLoading, setIsLoading ] = useState(false); // State loading
    const [ errorMsg, setErrorMsg ] = useState(""); // State untuk pesan error

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // Safety check jika token tidak ada sebelum decode
    const decode = token ? jwtDecode(token) : null; 
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            
            // Membuat URL lokal sementara untuk pratinjau gambar
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        const {fullname, username, noHp, alamat} = e.target;
        const formData = new FormData();

        formData.append('fullname', fullname.value);
        formData.append('username', username.value);
        formData.append('noHp', noHp.value);
        formData.append('alamat', alamat.value);
        
        // Hanya append jika file ada perubahan
        if (file) {
            formData.append('profilePfp', file);
        }

        try {
            // Await eksekusi api secara langsung
            await updateUser(decode.id, formData);
            
            // Hapus object URL untuk menghindari memory leak
            if (preview) URL.revokeObjectURL(preview); 
            
            navigate('/profile'); // Pindah halaman HANYA JIKA update berhasil
        } catch (error) {
            console.log(error);
            setErrorMsg("Gagal memperbarui profil. Silakan periksa koneksi Anda dan coba lagi.");
        } finally {
            setIsLoading(false); // Matikan loading state terlepas dari sukses/gagal
        }
    }

    useEffect(() => {
        if (!token || isTokenExpired(token)) {
            navigate('/login');
            return;
        }

        const fetchData = async (id) => {
            try {
                const res = await userData(id);
                setUser(res?.data);
            } catch (error) {
                console.error(error);
            }
        }

        if (decode?.id) {
            fetchData(decode.id);
        }
    }, [navigate, token, decode?.id]);

    return (
        <section className="relative min-h-screen flex flex-col">
            <Header customHeader={true} title={"Profil Pengguna"} />
            <main className="grow py-16 lg:py-24 px-4 flex flex-row justify-center">
                <div className="border border-stone-300 rounded-lg w-80 py-6 md:w-120">
                    <div className="flex flex-col items-center w-full gap-4">
                        <h1 className="text-2xl font-inter font-semibold">BIODATA PENGGUNA</h1>
                        
                        {/* Logika Pratinjau Gambar */}
                        {preview ? (
                            <img src={preview} alt="Preview Profil" className="size-32 rounded-full aspect-square object-cover border-2 border-stone-300" />
                        ) : user?.profilePfp ? (
                            <img src={`${API_URL}/api/images/users/${user?.profilePfp}`} alt="Profil" className="size-32 rounded-full aspect-square object-cover" />
                        ) : (
                            <UserCircleIcon className="size-24 text-stone-400"/>
                        )}
                        
                        <div>
                            <h2 className="text-base font-poppins text-center font-medium">{user?.fullname || 'Memuat...'}</h2>
                            <h4 className="text-sm text-center text-stone-500">Privilege : {user?.privilege?.[0]?.privilege || 'User'}</h4>
                        </div>
                    </div>
                    <div className="px-4 mt-8">
                        <h2 className="font-semibold">Ubah Profil</h2>
                        <hr className="px-4 my-2 border-stone-200" />
                        
                        {errorMsg && (
                            <div className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4 text-center">
                                {errorMsg}
                            </div>
                        )}

                        <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="fullname" className="text-sm text-stone-600 font-medium mb-1 block">Nama Lengkap</label>
                                <input name="fullname" id="fullname" className="input-text w-full mb-3" defaultValue={user?.fullname} placeholder="Contoh: Budi Santoso" required />
                                
                                <label htmlFor="username" className="text-sm text-stone-600 font-medium mb-1 block">Nama Pengguna</label>
                                <input name="username" id="username" className="input-text w-full mb-3" defaultValue={user?.username} placeholder="Contoh: Budi01" required />
                                
                                <label htmlFor="noHp" className="text-sm text-stone-600 font-medium mb-1 block">Nomor Telepon</label>
                                <input name="noHp" id="noHp" type="tel" className="input-text w-full mb-3" defaultValue={user?.noHp} placeholder="Contoh: 08123456789" required />
                                
                                <label htmlFor="alamat" className="text-sm text-stone-600 font-medium mb-1 block">Alamat Rumah</label>
                                <input name="alamat" id="alamat" className="input-text w-full mb-3" defaultValue={user?.alamat} placeholder="Contoh: Jl. melati no.3 rt02 rw01" required />
                                
                                <label htmlFor="profilePfp" className={`btn w-full cursor-pointer text-center flex items-center justify-center gap-2 mb-2 ${file ? 'bg-stone-100 text-stone-800 border border-stone-300' : ''}`}>
                                    <ArrowUpTrayIcon className="size-4 stroke-2" />
                                    {file ? 'Ubah file foto' : 'Upload foto profil'}
                                </label>
                                {file && <p className="text-xs text-center text-stone-500 mb-4 truncate px-2">{file.name}</p>}
                                <input name="profilePfp" id="profilePfp" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <button type="submit" disabled={isLoading} className={`btn-solid cursor-pointer transition-colors ${isLoading ? 'bg-stone-400 cursor-not-allowed' : 'active:bg-green-800 hover:bg-green-700'}`}>
                                    {isLoading ? 'Menyimpan...' : 'Perbarui Profil'}
                                </button>
                            </div>
                        </form>
                    </div> 
                </div>
            </main>
            <Footer />
        </section>
    )
}