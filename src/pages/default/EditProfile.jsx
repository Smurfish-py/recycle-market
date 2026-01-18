import Footer from "@/components/Footer";
import Header from "@/components/Header";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import isTokenExpired from "@/service/isTokenExpired";
import { userData, updateUser } from "@/controllers/user.controller";

import { UserCircleIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProfile() {
    const [ user, setUser ] = useState([]);
    const [ file, setFile ] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decode = jwtDecode(token);
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {fullname, username, noHp, alamat} = e.target;

        const formData = new FormData();

        formData.append('fullname', fullname.value);
        formData.append('username', username.value);
        formData.append('noHp', noHp.value);
        formData.append('alamat', alamat.value);
        formData.append('profilePfp', file);
        try {
            const updateProfile = async (data) => {
                const res = await updateUser(decode.id, data);
                return res;
            }

            updateProfile(formData);
        } catch (error) {
            console.log(error.data);
        }
    }

    useEffect(() => {
        token == null || isTokenExpired(token) ? navigate('/login') : "";

        const fetchData = async (id) => {
            try {
                const user = await userData( id );
                setUser(user?.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData(decode?.id);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col">
            <Header customHeader={true} title={"Profil Pengguna"} />
            <main className="grow py-16 lg:py-24 px-4 flex flex-row justify-center">
                <div className="border border-stone-300 rounded-lg w-80 py-6 md:w-120">
                    <div className="flex flex-col items-center w-full gap-4">
                        <h1 className="text-2xl font-inter font-semibold">BIODATA PENGGUNA</h1>
                        {user.profilePfp == undefined || user.profilePfp == null ? <UserCircleIcon className="size-24"/> : (
                            <>
                                <img src={`${API_URL}/api/images/users/${user?.profilePfp}`} />
                            </>
                        )}
                        
                        <div>
                            <h2 className="text-base font-poppins">{user.fullname}</h2>
                            <h4 className="text-sm text-center">Privilege : {user?.privilege?.[0]?.privilege}</h4>
                        </div>
                    </div>
                    <div className="px-4 mt-8">
                        <h2 className="font-semibold">Ubah Profil</h2>
                        <hr className="px-4 my-2" />
                        <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="fullname">Nama Lengkap</label>
                                <input name="fullname" className="input-text w-full mb-3" defaultValue={user.fullname} placeholder="Contoh: Budi Santoso"/>
                                <label htmlFor="username">Nama Pengguna</label>
                                <input name="username" className="input-text w-full mb-3" defaultValue={user.username} placeholder="Contoh: Budi01"/>
                                <label htmlFor="noHp">Nomor Telepon</label>
                                <input name="noHp" className="input-text w-full mb-3" defaultValue={user.noHp} placeholder="Contoh: 08123456789"/>
                                <label htmlFor="alamat">Alamat Rumah</label>
                                <input name="alamat" className="input-text w-full mb-3" defaultValue={user.alamat} placeholder="Contoh: Jl. melati no.3 rt02 rw01"/>
                                <label htmlFor="profilePfp">Foto Profil</label> <br />
                                <input name="profilePfp" type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <button type="submit" className="btn-solid cursor-pointer active:bg-green-800">Perbarui Profil</button>
                                <button className="btn-solid bg-red-400 border-none cursor-pointer" onClick={(e) => {
                                    e.preventDefault();
                                    localStorage.clear()
                                    navigate('/');
                                }}>
                                    Logout
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