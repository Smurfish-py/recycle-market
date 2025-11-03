import { UserCircleIcon, MagnifyingGlassIcon, UserIcon, ShoppingCartIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"
import Navigation from './Navigation'

export default function Header({ isOnProductPage }) {
    return (
        <header className="fixed top-0 right-0 left-0 px-4 py-2 z-20 border-b-1 border-b-stone-300 bg-white">
            <div className={`items-center justify-between ${isOnProductPage != true ? "flex" : "hidden sm:flex"}`}>
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
                <div id="button" className="sr-only sm:not-sr-only flex flex-row gap-2 select-none">
                    <a href="/login" className="btn flex flex-row items-center gap-2 hover:cursor-pointer">
                        <UserCircleIcon className="size-6"></UserCircleIcon>
                        <p>Akun</p>
                    </a>
                    <a href="" className="btn-solid flex flex-row items-center border gap-2 hover:cursor-pointer select-none">
                        <ShoppingCartIcon className="size-6"></ShoppingCartIcon>
                        <span>Troli</span>
                    </a>
                </div>
                <i className="visible sm:hidden">
                    <UserCircleIcon className="size-10"></UserCircleIcon>  
                </i>
            </div>
            <div className={`h-8 ${isOnProductPage == true ? "flex sm:hidden" : "hidden"} items-center`} onClick={() => window.history.back()}>
                <ChevronLeftIcon className="size-5 stroke-2"></ChevronLeftIcon>
                <button className="text-sm">Kembali</button>
            </div>
        </header>
    )
}