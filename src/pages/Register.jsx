import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from 'react'
import illustration from '@/assets/images/login-illustration.png'


function Register() {
    const [ passwordVisible, setPasswordVisible] = useState(false);
    const [ retypeVisible, setRetypeVisible] = useState(false);

    return (
        <>
            <div className="flex flex-row">
                <div id="image-container" className="hidden md:block md:flex-3/8">
                    <img src={illustration} className="hidden object-cover md:block w-full h-full select-none pointer-events-none" />
                </div>
                <div id="form-container" className="flex-col gap-8 w-full md:flex-1">
                    <header className="px-8 py-4 flex justify-between items-center">
                        <a href="/" className="flex flex-col gap-0.5">
                            <h1 className="font-inter font-semibold text-base md:text-sm lg:text-base">Recycle Market</h1>
                            <h3 className="font-poppins font-normal text-xs md:text-[8px] lg:text-xs">Resell, Reuse, Recycle</h3>
                        </a>
                        <p className="font-poppins font-normal text-xs md:text-[8px] lg:text-xs">By Kelompok 13</p>
                    </header>
                    <main className="px-8 py-4 flex flex-col gap-8 mt-4">
                        <h1 className="font-inter font-medium text-4xl md:text-2xl lg:text-4xl">Sign Up</h1>
                        <div id="form">
                            <form action="" method="post" className="font-poppins flex flex-col gap-4">
                                <div id="form-input">
                                    <label htmlFor="nama" className="text-lg font-light md:text-sm lg:text-base">Nama</label><br />
                                    <input id="nama" type="text" placeholder="Masukkan nama anda" className="input-text w-full h-10 px-4 md:text-xs lg:text-base"  name="nama" />
                                </div>
                                <div id="form-input">
                                    <label htmlFor="email" className="text-lg font-light md:text-sm lg:text-base">Email</label><br />
                                    <input id="email" type="email" placeholder="Masukkan email anda" className="input-text w-full h-10 px-4 md:text-xs lg:text-base" name="email" />
                                </div>
                                <div id="form-input">
                                    <label htmlFor="password" className="text-lg font-light md:text-sm lg:text-base">Password</label><br />
                                    <div className="relative w-full">
                                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
                                            {passwordVisible ? (
                                                <EyeSlashIcon className="absolute h-6 w-6 md:h-3 md:w-3 lg:h-6 lg:w-6 right-4 top-1/2 -translate-y-1/2 opacity-50 cursor-pointer hover:opacity-90"></EyeSlashIcon>
                                                ) : (
                                                <EyeIcon className="absolute h-6 w-6 md:h-3 md:w-3 right-4 md:right-4 lg:h-6 lg:w-6 top-1/2 -translate-y-1/2 opacity-50 cursor-pointer hover:opacity-90"></EyeIcon>
                                                )}
                                        </button> 
                                        <input id="password" type={passwordVisible ? "text" : "password"} placeholder="Masukkan password anda" className="input-text w-full h-10 px-4 md:text-xs lg:text-base" name="password"/>
                                    </div>
                                </div>
                                <div id="form-input">
                                    <label htmlFor="password" className="text-lg font-light md:text-sm lg:text-base">Konfirmasi Password</label><br />
                                    <div className="relative w-full">
                                        <button type="button" onClick={() => setRetypeVisible(!retypeVisible)}>
                                            {retypeVisible ? (
                                                <EyeSlashIcon className="absolute h-6 w-6 md:h-3 md:w-3 lg:h-6 lg:w-6 right-4 top-1/2 -translate-y-1/2 opacity-50 cursor-pointer hover:opacity-90"></EyeSlashIcon>
                                                ) : (
                                                <EyeIcon className="absolute h-6 w-6 md:h-3 md:w-3 lg:h-6 lg:w-6 right-4 md:right-4 top-1/2 -translate-y-1/2 opacity-50 cursor-pointer hover:opacity-90"></EyeIcon>
                                                )}
                                        </button> 
                                        <input id="password" type={retypeVisible ? "text" : "password"} placeholder="Ketik ulang password anda" className="input-text w-full h-10 px-4 md:text-xs lg:text-base" name="retypePassword"/>
                                    </div>
                                </div>

                                <hr className="my-2 opacity-20" />

                                <div id="button-and-helps">
                                    <button type="submit" className="btn-solid w-full h-10 md:text-sm lg:text-base">SIGN IN</button>
                                    <p className="font-poppins font-light text-center mt-6 text-sm md:text-[12px] lg:text-sm">
                                        Sudah punya akun?
                                        <span>
                                            <a href="/login" className="font-semibold"> Login Disini</a>
                                        </span>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Register;