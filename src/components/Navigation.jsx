import { useState, useEffect, useRef } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"

function Navigation({ className, listStyle }) {
    const [ isOpen, setIsOpen ] = useState(false);
    const navigationList = ["Elektronik", "Non_elektronik"]
    
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [])

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
                <a href="">Toko</a>
                <a href="">Mitra</a>
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