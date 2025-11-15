import { UserCircleIcon, MagnifyingGlassIcon, ArrowLeftEndOnRectangleIcon, BookmarkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from './Navigation';

import isTokenExpired from "../service/isTokenExpired";

export default function Header({ customHeader, title }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if ( token == undefined || isTokenExpired(token) ) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }
    }, [])

    return (
        <header className="fixed top-0 right-0 left-0 px-4 py-2 z-20 border-b-1 border-b-stone-300 bg-white">
            <div className={`items-center justify-between ${customHeader != true ? "flex" : "hidden sm:flex"}`}>
                <div id="title" className="select-none">
                    <a href="/">
                        <h1 className="font-inter font-semibold text-xl">Recycle Market</h1>
                        <h3 className="font-poppins font-normal text-xs">Resell, Reuse, Recycle</h3>
                    </a>
                </div>
                <Navigation className="sr-only min-[1280px]:not-sr-only gap-4" listStyle="dropdown absolute left translate-y-3 -translate-x-2.5 w-50" />
                <form className="sr-only sm:not-sr-only">
                    <div className="relative md:w-75 lg:w-100">
                        <button className="absolute left-4 top-1/2 -translate-1/2 cursor-pointer" location="header">
                            <MagnifyingGlassIcon className=" size-4 stroke-2"></MagnifyingGlassIcon>
                        </button>
                        <input type="text" className="pl-8 pr-4 input-text-solid font-poppins w-full" placeholder="Cari yang kamu butuhkan"></input>
                    </div>
                </form>
                {isLoggedIn ? (
                    <>
                        <div id="button" className="sr-only sm:not-sr-only flex flex-row gap-2 select-none">
                            <a href="/profile" className="btn flex flex-row items-center gap-2 hover:cursor-pointer">
                                <UserCircleIcon className="size-6" />
                                <p>Akun</p>
                            </a>
                            <a href='/bookmark' className="btn-solid flex flex-row items-center border gap-1 hover:cursor-pointer select-none">
                                <BookmarkIcon className="size-6" />
                                <p>Markah</p>
                            </a>
                        </div>
                        <i className="visible sm:hidden">
                            <UserCircleIcon className="size-10"></UserCircleIcon>  
                        </i>
                    </>
                ) : (
                    <a className="btn-solid flex flex-row items-center border gap-2 hover:cursor-pointer select-none pr-3" href="/login">
                        <ArrowLeftEndOnRectangleIcon className="size-6"/>
                        <p>Sign In</p>
                    </a>
                )}
            </div>
            <div className={`h-8 ${customHeader == true ? "flex relative sm:hidden" : "hidden"} flex-row items-center`} onClick={() => window.history.back()}>
                <ChevronLeftIcon className="absolute left-0 size-5 stroke-2"></ChevronLeftIcon>
                <div className="font-poppins font-semibold text-center w-full ">
                    { title }
                </div>
            </div>
        </header>
    )
}