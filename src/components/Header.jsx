import { UserCircleIcon } from "@heroicons/react/24/outline"

export default function Header() {
    return (
        <header className="h-16 w-full px-4 py-8 flex justify-between items-center shadow-md">
            <a href="border flex w-2/3">
                <h1 className="font-inter font-semibold text-green-main-1 text-xl">Recycle Market</h1>
                <h3 className="font-poppins text-xs">Resell, Reuse, Recycle</h3>
            </a>
            
            <i>
                <UserCircleIcon className="h-10 w-10 text-green-main-1"></UserCircleIcon>
            </i>
        </header>
    )
}