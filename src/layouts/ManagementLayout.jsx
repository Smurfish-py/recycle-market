import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { HomeIcon, UserIcon, ShoppingBagIcon, InboxArrowDownIcon, BanknotesIcon, Cog6ToothIcon, ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import isTokenExpired from "../service/isTokenExpired";
import { userData } from "../controllers/user.controller";

export default function ManagementLayout() {
    const [ quote, setQuote ] = useState({});
    const [ userInfo, setUserInfo ] = useState(null);
    const [ open, setOpen ] = useState(false);

    const navigate = useNavigate();

    const fetchUserData = async (id) => {
        try {
            const res = await userData(id);
            setUserInfo(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    function handleOpen() {
        setOpen(!open)
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token == null || isTokenExpired(token)) {
            navigate('/login');
        }

        const decode = jwtDecode(token);
        fetchUserData(decode.id);
    }, []);

    const adminMenu = [
        { label: "Dashboard", to:"/dashboard/admin", icon:HomeIcon, end: true },
        { label: "Pengguna", to:"/dashboard/admin/pengguna", icon: UserIcon },
        { label: "Produk", to:"/dashboard/admin/produk", icon:ShoppingBagIcon },
        { label: "Permintaan", to:"/dashboard/admin/requests", icon: InboxArrowDownIcon },
        { label: "Pesanan", to:"/dashboard/admin/pesanan", icon: BanknotesIcon },
    ]

    const quotes = [
        {
            pengutip: "Margaret Mead",
            quote: "We won't have a society if we destroy the environment"
        },
        {
            pengutip: "Mohith Agadi",
            quote: "Environment is no one's property to destroy; it's everyone's responsibility to protect"
        },
        {
            pengutip: "Dennis Weaver",
            quote: "We don't have to sacrifice a strong economy for a healthy environment"
        },
    ]

    useEffect(() => {
        const selectedQuotes = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(selectedQuotes);
    }, []);

    useEffect(() => {

    }, []);

    return (
        <div className="flex flex-row">
            <aside className={`fixed md:flex left-0 z-50 flex-1/5 border-r-1 border-zinc-300 h-screen px-4 py-2 flex-col gap-4 bg-white md:sticky ${open ? 'w-2/3 md:hidden' : 'hidden'}`}>
                <div className="border-b-1 border-stone-200 pb-2 flex flex-row items-center justify-between">
                    <div id="title" className="select-none">
                        <a href="/" className="font-inter font-semibold text-xl">Recycle Market</a>
                        <h3 className="font-poppins font-normal text-xs">Resell, Reuse, Recycle</h3>
                    </div>
                    <button className="cursor-pointer md:hidden" onClick={() => handleOpen()}>
                        <XMarkIcon className="size-5" />
                    </button>
                    
                </div>
                
                <h4 className="my-2 md:my-0 font-inter text-sm text-zinc-400">Halaman Utama</h4>
                <nav className="space-y-2">
                    {adminMenu.map((item) => {
                        const Icon = item.icon;

                        return (
                                <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                role="button"
                                className={({ isActive }) => `block py-1 border-l-3 ${isActive ? "border-l-3 text-green-main-2 font-semibold" : "border-transparent hover:border-green-main-2 hover:text-green-main-2 hover:font-semibold"}`}
                                >
                                    <div className="flex flex-row gap-4 items-center mx-2">
                                        <Icon className="w-5 h-5 " />
                                        <span>{item.label}</span>
                                    </div>
                                </NavLink>
                            )
                        })
                    }
                </nav>
                <hr className="my-2 md:my-0 border-stone-200" />
                <h4 className="my-2 md:my-0 font-inter text-sm text-zinc-400">Quote Section</h4>
                <section className="h-7/13 flex flex-col justify-between">
                    <div className="bg-stone-200 border-l-3 border-zinc-600 px-4 py-2 italic text-zinc-500">
                        "{ quote.quote }" <br />
                        - { quote.pengutip }
                    </div>
                    <div className="py-2 border-t-1 border-stone-200">
                        <button className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
                            <Cog6ToothIcon className="h-5 w-5" />
                            <span>Pengaturan Akun</span>
                        </button>
                    </div>
                </section>
            </aside>
            <main className="flex-4/5">
                <header className="sticky top-0 flex flex-row justify-between px-4 py-4 border-b-1 border-b-stone-300 bg-white left-*">
                    <div className="flex gap-4">
                        <button className="cursor-pointer" onClick={() => setOpen(prev => !prev)}>
                            <ListBulletIcon className="w-5 h-5" />
                        </button>
                        <h2 className="font-inter text-xl font-semibold">Dashboard</h2>
                    </div>
                    <p className="hidden sm:block">{userInfo?.username}</p>
                    <p className="text-md">
                        <span className="bg-sky-100 px-4 py-1 rounded-sm font-semibold text-sm text-sky-400">
                            { userInfo?.privilege?.[0]?.privilege }
                        </span>
                    </p>
                </header>
                <section className="px-4 py-2">
                    <Outlet context={ userInfo } />
                </section>
            </main>
        </div>
    )
}