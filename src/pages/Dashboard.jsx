import Navigation from "@/components/Navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Dashboard() {
    return (
        <main className="flex flex-col items-center gap-4 pt-16">
            <section className="w-full flex gap-3 flex-col min-[320px]:px-2 min-[480px]:max-sm:px-12 sm:px-0 lg:hidden">
                <Navigation className="not-sr-only min-[1280px]:sr-only flex justify-between sm:justify-center sm:gap-16" listStyle="dropdown absolute w-40 right-0 sm:-left-2 translate-y-2"/>
                <form className="not-sr-only sm:sr-only">
                    <div className="relative">
                        <button className="absolute left-4 top-1/2 -translate-1/2 cursor-pointer" location="header">
                            <MagnifyingGlassIcon className=" size-4 stroke-2"></MagnifyingGlassIcon>
                        </button>
                        <input type="text" className="pl-8 pr-4 input-text-solid font-poppins w-full" placeholder="Cari yang kamu butuhkan"></input>
                    </div>
                </form>
            </section>
            <article className="w-full pt-4">
                <section id="hero" className="sr-only *:font-inter text-center flex flex-col gap-4 pt-8 select-none lg:not-sr-only">
                    <h3 className="text-xl">Kelompok 13</h3>
                    <h1 className="font-semibold text-8xl">RECYCLE MARKET</h1>
                    <h2 className="font-semibold text-2xl">Resell, Reuse, Recycle</h2>
                </section>
            </article>
        </main>
    )
}

export default Dashboard;