import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { searchProduct } from "@/controllers/product.controller";

export default function SearchBar({ className, sendToParent }) {
    const handleSearch = async (e) => {
        e.preventDefault();
        const nama = e.target.query.value;
        try {
            const productData = await searchProduct(nama);
            if (productData < 1) return "Produk tidak ditemukan";

            sendToParent(productData);
        } catch (error) {
            throw error;
        }
    }

    return (
        <form className={ [className] } onSubmit={handleSearch} >
            <div className="relative md:w-75 lg:w-100">
                <button className="absolute left-4 top-1/2 -translate-1/2 cursor-pointer" location="header">
                    <MagnifyingGlassIcon className=" size-4 stroke-2"></MagnifyingGlassIcon>
                </button>
                <input type="text" className="pl-8 pr-4 input-text-solid font-poppins w-full" placeholder="Cari yang kamu butuhkan" name="query"></input>
            </div>
        </form>
    )
}