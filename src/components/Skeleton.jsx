export default function Skeleton() {
    return (
        // Skeleton Container
        <div className="flex items-center gap-4 px-2 animate-pulse md:flex-col min-[480px]:max-[640px]:px-12">

            {/* Product Photo */}
            <div className="rounded-md bg-gray-200 size-26 md:w-80 md:h-40"></div>

            {/* Product details */}
            <div className="h-full py-3 flex flex-col gap-3 justify-center md:justify-start md:w-full md:h-auto md:gap-4 md:px-2">

                {/* Product name and seller */}
                <div className="flex flex-col gap-1.5">

                    {/* Product name */}
                    <div className="h-4 w-35 bg-gray-200 rounded-full md:h-6"></div>

                    {/* Seller */}
                    <div className="flex flex-row gap-1 items-center">
                        <div className="size-4 bg-gray-200 rounded-full md:size-5"></div>
                        <div className="h-2 w-20 bg-gray-200 rounded-full md:h-3"></div>
                    </div>

                </div>
                
                {/* Price and tags */}
                <div className="flex flex-col gap-2">

                    {/* Price */}
                    <div className="h-5 w-20 bg-gray-200 rounded-full md:w-25"></div>

                    {/* Tags */}
                    <div className="flex flex-row gap-2">
                        <div className="h-4.5 w-21 bg-gray-200 rounded-full"></div>
                        <div className="h-4.5 w-21 bg-gray-200 rounded-full"></div>
                    </div>

                </div>

            </div>
            
        </div>
    )
}