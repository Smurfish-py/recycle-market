import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout() {
    
    return (
        <div className="relative flex flex-col min-h-screen">
            <Header customHeader={false} />
            <main className="px-4 py-2 grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}