import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from 'react'


function Login() {
    const [ visible, setVisible] = useState(false);

    return (
        <>
            <div id="container" className="flex flex-col gap-8">
                <header className="px-8 py-4 flex justify-between items-center">
                    <a href="" className="flex flex-col gap-0.5">
                        <h1 className="font-inter font-semibold text-md">Recycle Market</h1>
                        <h3 className="font-poppins font-normal text-xs">Resell, Reuse, Recycle</h3>
                    </a>
                    <p className="font-poppins font-normal text-xs">By Kelompok 13</p>
                </header>
                <main className="px-8 py-4 flex flex-col gap-8">
                    <div id="title" className="flex flex-col gap-3">
                        <h1 className="font-inter font-medium text-4xl">Sign In</h1>
                        <p className="font-poppins font-normal text-sm">Selamat datang kembali pengguna yang terhormat!</p>
                    </div>
                    <div id="form">
                        <form action="" method="post" className="font-poppins flex flex-col gap-4">
                            <div id="form-input">
                                <label htmlFor="email" className="text-lg font-light">Email</label><br />
                                <input id="email" type="email" placeholder="Masukkan email anda" className="input-text w-full h-10 px-4"/>
                            </div>
                            <div id="form-input">
                                <label htmlFor="password" className="text-lg font-light">Password</label><br />
                                <div className="relative w-full">
                                    <button type="button" onClick={() => setVisible(!visible)}>
                                        {visible ? (
                                            <EyeSlashIcon className="absolute h-6 w-6 right-4 top-1/2 -translate-y-1/2 opacity-50"></EyeSlashIcon>
                                            ) : (
                                            <EyeIcon className="absolute h-6 w-6 right-4 top-1/2 -translate-y-1/2 opacity-50"></EyeIcon>
                                            )}
                                    </button> 
                                    <input id="password" type={visible ? "text" : "password"} placeholder="Masukkan password anda" className="input-text w-full h-10 px-4"/>
                                </div>
                            </div>

                            <hr className="my-4 opacity-20" />

                            <div id="button-and-helps">
                                <a href="" className="text-left text-sm">Lupa password</a> <br />
                                <button type="submit" className="btn-solid w-full h-10 mt-2">SIGN IN</button>
                                <p className="font-poppins font-light text-center mt-16 text-sm">
                                    Belum punya akun? 
                                    <span>
                                        <a href="" className="font-semibold"> Buat Akun</a>
                                    </span>
                                </p>
                            </div>
                        </form>
                        
                    </div>
                </main>
            </div>
        </>
    )
}

export default Login;