import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import isTokenExpired from "../service/isTokenExpired";

import { findShopDataByUser } from '@/controllers/shop.controller';

function Navigation({ className, listStyle }) {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ myShop, setMyShop ] = useState(null);
    const navigationList = ["Elektronik", "Non_elektronik"];
    const token = localStorage.getItem('token');
    
    const decodeToken = () => {
        if (token == null || token == undefined) {
            return
        } else {
            return jwtDecode(token);
        }
    }

    const decode = decodeToken();

    const dropdownRef = useRef(null);

    useEffect(() => {
        async function findShop(idUser) {
            const res = await findShopDataByUser(idUser);

            if (res.length < 1) {
                return setMyShop('/partnership');
            }
            
            setMyShop(`/shop/${res?.[0]?.id}`);
        }

        findShop(decode?.id);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [decode])

    let content = (
        <div className={`${listStyle} ${!isOpen ? "hidden" : "visible"} flex flex-col z-20`}>
            {navigationList.map((navList, index) => (
                <a href={`/category/${navList?.toUpperCase()}`} key={index} className="p-2 active:bg-stone-100 hover:bg-stone-100 cursor-pointer">{navList}</a>
                
            ))}
        </div>
    );

    return (
        <nav ref={dropdownRef}>
            <div className={`${className} flex flex-row select-none`}>
                <a href="/">Beranda</a>
                {decode?.privilege == "ADMIN" && !isTokenExpired(token) ? (
                    <a href="/dashboard/admin">Admin</a>
                ) : (
                    <a href={myShop}>Toko</a>
                )}
                <a href="/partnership">Mitra</a>
                <div className="relative">
                    <div onClick={() => setIsOpen(!isOpen)} className="flex flex-row gap-2 items-center cursor-pointer">
                        <p>Kategori</p>
                        <i>
                            {!isOpen ? (<ChevronDownIcon className="size-3 stroke-3"></ChevronDownIcon>) : (<ChevronUpIcon className="size-3 stroke-3"></ChevronUpIcon>)}
                        </i>
                    </div>
                    { content }
                </div>
            </div>
        </nav>
    )
}

export default Navigation