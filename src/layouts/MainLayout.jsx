import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function MainLayout() {
    const [ queryResults, setQueryResults ] = useState([]);

    return (
        <div className="relative flex flex-col min-h-screen">
            <Header customHeader={false} sendToParent={setQueryResults} />
            <main className="px-4 py-2 grow">
                <Outlet context={{ queryResults }}/>
            </main>
            <Footer />
        </div>
    )
}