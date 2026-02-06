import placeholder from '@/assets/images/login-illustration.png';

export default function BookmarkPage() {
    
    return (
        <div className="mt-16 w-full">
            <div className="w-full border border-zinc-300 flex flex-col h-100">
                <img src={placeholder} className='flex-2/3 h-full w-full object-cover' />
                <section className='flex-1/3 flex flex-col justify-center px-10'>
                    <h2 className='text-4xl'>Markah Saya</h2>
                    <h4>Lihat barang-barang yang sudah kamu simpan</h4>
                </section>
            </div>
            <h2 className='text-2xl my-6 text-center'>Produk yang kamu simpan</h2>

        </div>
    )
}