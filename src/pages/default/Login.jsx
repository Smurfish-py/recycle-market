import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import illustration from '@/assets/images/login-illustration.png';
import { handleLogin } from "../../controllers/user.controller";
import isTokenExpired from "../../service/isTokenExpired";

function Login() {
    const [ visible, setVisible] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        {token == null || isTokenExpired(token) ? "" : navigate('/')}
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const token = await handleLogin( email, password );
            if (token != undefined) {
                localStorage.setItem('token', token);
                navigate('/');
            }
            
        } catch (error) {
            setErrorMsg(error);
        }
    }

    return (
        <>
            <div className="flex flex-row">
                <div id="form-container" className="flex-col gap-8 w-full md:flex-1">
                    <header className="px-8 py-4 flex justify-between items-center">
                        <a href="/" className="flex flex-col gap-0.5">
                            <h1 className="font-inter font-semibold text-base md:text-sm lg:text-base">Recycle Market</h1>
                            <h3 className="font-poppins font-normal text-xs md:text-[8px] lg:text-xs">Resell, Reuse, Recycle</h3>
                        </a>
                        <p className="font-poppins font-normal text-xs md:text-[8px] lg:text-xs">By Kelompok 13</p>
                    </header>
                    <main className="px-8 py-4 flex flex-col gap-8 mt-4">
                        <div id="title" className="flex flex-col gap-3">
                            <h1 className="font-inter font-medium text-4xl md:text-2xl lg:text-4xl">Sign In</h1>
                            <p className="font-poppins font-normal text-sm md:text-xs lg:text-base">Selamat datang kembali pengguna yang terhormat!</p>
                        </div>
                        {errorMsg !== '' ? (
                            <div className="flex items-center gap-3 px-2 py-1 text-sm w-full min-h-12 border-1 border-red-300 bg-red-100 rounded-sm text-red-500">
                                <ExclamationTriangleIcon className="size-8" />
                                <p>{errorMsg}</p>
                            </div>
                        ) : ""}
                        <div id="form">
                            <form onSubmit={ handleSubmit } method="post" className="font-poppins flex flex-col gap-4">
                                <div id="form-input">
                                    <label htmlFor="email" className="text-lg font-light md:text-sm lg:text-base">Email</label><br />
                                    <input id="email" type="email" placeholder="Masukkan email anda" className="input-text w-full h-10 px-4 md:text-xs lg:text-base" name="email" />
                                </div>
                                <div id="form-input">
                                    <label htmlFor="password" className="text-lg font-light md:text-sm lg:text-base">Password</label><br />
                                    <div className="relative w-full">
                                        <button type="button" onClick={() => setVisible(!visible)}>
                                            {visible ? (
                                                <EyeSlashIcon className="absolute size-6 md:size-3 lg:size-6 right-3 top-1/2 -translate-y-1/2 opacity-50 cursor-pointer hover:opacity-90"></EyeSlashIcon>
                                                ) : (
                                                <EyeIcon className="absolute size-6 md:size-3 lg:size-6 right-3 top-1/2 -translate-y-1/2 opacity-50 cursor-pointer hover:opacity-90"></EyeIcon>
                                                )}
                                        </button> 
                                        <input id="password" type={visible ? "text" : "password"} placeholder="Masukkan password anda" className="input-text w-full h-10 px-4 md:text-xs lg:text-base" name="password" />
                                    </div>
                                </div>

                                <hr className="my-4 opacity-20" />

                                <div id="button-and-helps">
                                    <a href="" className="text-left text-sm md:text-xs lg:text-sm">Lupa password?</a> <br />
                                    <button type="submit" className="btn-solid w-full h-10 mt-2 cursor-pointer md:text-sm lg:text-base">SIGN IN</button>
                                    <p className="font-poppins font-light text-center mt-8 text-sm md:text-[12px] lg:text-sm">
                                        Belum punya akun? 
                                        <span>
                                            <a href="/register" className="font-semibold"> Buat Akun</a>
                                        </span>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
                <div id="image-container" className="hidden md:block md:flex-3/8">
                    <img src={illustration} className="hidden object-cover md:block w-full h-full select-none pointer-events-none"/>
                </div>
            </div>
        </>
    )
}

export default Login;