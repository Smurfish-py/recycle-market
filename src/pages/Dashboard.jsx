import Navigation from "../components/Navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Dashboard() {
    return (
        <main className="flex items-center justify-center">
            <div className="w-full flex gap-3 flex-col min-[320px]:px-2 min-[480px]:max-sm:px-12 sm:px-0">
                <Navigation className="not-sr-only min-[1280px]:sr-only flex justify-between sm:justify-start text-sm" listStyle="dropdown absolute right-0 w-40 translate-y-2"/>
                <form className="not-sr-only sm:sr-only">
                    <div className="relative">
                        <button className="absolute left-4 top-1/2 -translate-1/2 cursor-pointer" location="header">
                            <MagnifyingGlassIcon className=" size-4 stroke-2"></MagnifyingGlassIcon>
                        </button>
                        <input type="text" className="pl-8 pr-4 input-text-solid font-poppins w-full" placeholder="Cari yang kamu butuhkan"></input>
                    </div>
                </form>
            </div>
            
        </main>
    )
}

export default Dashboard;