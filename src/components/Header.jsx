import { ArrowLeftStartOnRectangleIcon, UserIcon, UserCircleIcon,  ArrowLeftEndOnRectangleIcon, BookmarkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { userData } from "../controllers/user.controller";
import isTokenExpired from "../service/isTokenExpired";

import Navigation from './Navigation';
import SearchBar from "./SearchBar";

export default function Header({ customHeader, title, sendToParent}) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [ productData, setProductData ] = useState([]);
    const [ user, setUser ] = useState({});

    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode(token) : null;

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (isLoggedIn) {
            const findUser = async (id) => {
                try {
                    const res = await userData(id);
                    setUser(res?.data);
                } catch (error) {
                    console.log(error);
                }
            }
            findUser(decode?.id);
        }
    }, [isLoggedIn, decode.id]);
    
    
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    useEffect(() => {
        if ( token == undefined || isTokenExpired(token) ) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }
    }, [token]);

    
    useEffect(() => {
        sendToParent?.(productData);
    }, [productData]);

    const userOption = (
        <div className={`absolute border-1 border-stone-300 rounded-md top-2 translate-y-15 right-3 bg-white w-40 h-40 px-2 py-2 ${isOpen ? "block" : "hidden"} flex flex-col justify-between gap-2`}>
            <div className="flex flex-col gap-2">
                <h1 className="text-center font-inter font-semibold text-sm pb-2 border-b-1 border-stone-200">Pengaturan Akun</h1>
                <div className="px-2 flex items-center gap-4">
                    {!user?.profilePfp ? (
                        <UserIcon className="size-6" />
                    ) : (
                        <div className="w-8 aspect-square rounded-full overflow-hidden">
                            <img src={`${API_URL}/api/images/users/${user?.profilePfp}`} className="object-cover" />
                        </div>
                    )}
                    <p className="flex flex-col gap-0 text-sm text-left active:underline hover:underline" onClick={() => navigate('/profile')}><strong>Edit Profil</strong><span className="text-xs">{user.username}</span></p>
                </div> 
            </div>

            <div className="px-2 flex items-center border-t border-stone-200 pt-2 text-red-400" onClick={() => logout()}>
                <ArrowLeftStartOnRectangleIcon className="size-6" />
                <p className="text-sm text-right w-full">Logout</p>
            </div>
        </div>
    )

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

                <SearchBar className={"sr-only sm:not-sr-only"} sendToParent={setProductData} />

                {isLoggedIn ? (
                    <>
                        <div id="button" className="relative sr-only sm:not-sr-only flex flex-row gap-2 select-none">
                            <a href="/profile" className="btn flex flex-row items-center gap-2 hover:cursor-pointer">
                                <UserCircleIcon className="size-6" />
                                <p>Akun</p>
                            </a>
                            <a href='/bookmark' className="btn-solid flex flex-row items-center border gap-1 hover:cursor-pointer select-none">
                                <BookmarkIcon className="size-6" />
                                <p>Markah</p>
                            </a>
                        </div>
                        <button className="visible sm:hidden" >
                            <UserCircleIcon className="size-10" onClick={() => setIsOpen(!isOpen)}></UserCircleIcon>
                            { userOption }
                        </button>
                    </>
                ) : (
                    <a className="btn-solid flex flex-row items-center border gap-2 hover:cursor-pointer select-none pr-3" href="/login">
                        <ArrowLeftEndOnRectangleIcon className="size-6"/>
                        <p>Sign In</p>
                    </a>
                )}
            </div>
            <div className={`h-8 ${customHeader == true ? "flex relative sm:hidden" : "hidden"} flex-row items-center`}>
                <ChevronLeftIcon className="absolute left-0 size-5 stroke-2" onClick={() => window.history.back()} />
                <div className="font-poppins font-semibold text-center w-full select-none">
                    { title }
                </div>
            </div>
        </header>
    )
}