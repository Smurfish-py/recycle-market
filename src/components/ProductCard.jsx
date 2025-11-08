import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ tagColor, product, API_URL }) {
    const navigate = useNavigate();

    return (
        <div className="card items-center sm:max-md:w-full px-2 min-[480px]:max-[640px]:px-12 flex gap-2 sm:gap-0 md:flex-col md:items-start">

            {/* Product picture */}
            <div className="cursor-pointer sm:min-w-26 md:h-40 transition duration-300 hover:brightness-75 active:brightness-75" onClick={() => navigate(`/product/${product.id}`)}>
                {
                product.fotoProduk?.[0]?.file ? (
                    
                    <img src={`${API_URL}/api/images/products/${product?.fotoProduk?.[0]?.file}`} className="size-26 rounded-md object-cover object-top md:w-80 md:h-40 sm:object-cover md:object-[25%_15%]" />
                    
                ) : (
                    <div className="size-26 rounded-md bg-gray-200 flex items-center justify-center text-xs text-center md:w-80 md:h-40">
                        <p className="font-inter font-semibold text-gray-400">Tidak ada Foto</p>
                    </div>
                )}
            </div>

            <div className="h-full py-3 flex flex-col gap-2 justify-center sm:px-2 sm:gap-4">
            {/* Product Details */}
                {/* Product name and Seller */}
                <div>
                    {/* Product Name */}
                    <h2 className="hyperlink font-inter font-semibold md:text-xl" onClick={() => navigate(`/product/${product.id}`)}>{product?.nama}</h2>
                    {/* Seller */}
                    <div className="flex flex-row gap-1">
                        <UserCircleIcon className="size-4 md:size-5"></UserCircleIcon>
                        <h4 className="hyperlink font-poppins font-normal text-xs md:text-sm" onClick={() => navigate(`/toko/${product.toko?.nama}`)}>{product.toko?.nama}</h4>
                    </div>
                </div>
                {/* Product price and tags */}
                <div className="flex flex-col gap-2">
                    {/* Price */}
                    <h3 className="font-inter font-semibold text-xl md:text-2xl">Rp. {product?.harga?.toLocaleString('id-ID')} <span className="text-sm">/{product.jenisHarga}</span></h3>
                    {/* Tags */}
                    <div className="flex flex-row gap-2">
                        <a href={`/category/${product.kategori}`} className={`text-xs border-1 py-0.5 px-1.5 md:text-sm rounded-full ${tagColor[product.kategori]}`}>{product.kategori}</a>
                        <a href="" className={`text-xs border-1 py-0.5 px-1.5 md:text-sm rounded-full ${tagColor[product.kualitas]}`}>{product.kualitas}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}