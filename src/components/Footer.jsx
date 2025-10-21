import logo from '@/assets/images/starry-night.jpg'

import { PhoneIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);


function Footer() {
    return (
        <footer className="w-full bg-green-main-1 min-h-50 flex flex-col md:flex-row px-6 py-4 gap-12 text-white md:px-12 md:py-8">
            
            {/* Merk + Slogan */}
            <section className="flex flex-col flex-1 gap-4 text-center md:text-left">
                <div id="title" className="select-none md:flex md:flex-row md:items-center md:gap-4">
                    <img src={logo} className='hidden rounded-full size-10 lg:block'/>
                    <div>
                        <h1 className="font-inter font-semibold text-xl">Recycle Market</h1>
                        <h3 className="font-poppins font-normal text-xs lg:hidden">Resell, Reuse, Recycle</h3>
                    </div>
                </div>
                <p className='text-xs'>Platform inovatif untuk menukar barang daur ulang menjadi uang atau produk yang telah bermanfaat</p>
                <p className='text-sm'>&copy; 2025 Kelompok 13 - MIT Lisence </p>
            </section>

            {/* Navigasi */}
            <section className='flex-1 sr-only md:not-sr-only md:flex md:flex-col md:gap-6'>
                <h1 className='sr-only font-inter text-xl font-semibold md:not-sr-only'>Navigasi</h1>
                <div className='flex flex-col gap-2 font-poppins'>
                    <a href=''>Beranda</a>
                    <a href=''>Produk</a>
                    <a href=''>Kontak Kami</a>
                    <a href=''>FAQ</a>
                </div>
            </section>

            {/* Kontak */}
            <section className="flex flex-row flex-1 text-xs items-center justify-between md:flex-col md:justify-normal md:items-start md:gap-6 md:text-sm">
                <h1 className='sr-only font-inter text-xl font-semibold md:not-sr-only'>Kontak</h1>
                <div className='flex flex-col gap-2 font-poppins'>
                    <div className='flex flex-row gap-2 items-center'>
                        <EnvelopeIcon className='size-4 stroke-2' />
                        <p>support@recyclemarket.com</p>
                    </div>
                    <div className='flex flex-row gap-2 items-center'>
                        <PhoneIcon className='size-4 stroke-2' />
                        <p>+62 812-3456-7890</p> 
                    </div>
                </div>
                <div className='flex flex-row gap-2'>
                    <a href='https://github.com/Smurfish-py/recycle-market'>
                        <FontAwesomeIcon icon="fa-brands fa-github" size='2x' />
                    </a>
                    <a href='https://www.notion.so/RECYCLE-MARKET-Perencanaan-269ea26622cb80dd9b78dfef638487a7?source=copy_link'>
                        <FontAwesomeIcon icon="fa-brands fa-notion" size='2x' />
                    </a>
                    <a href='https://www.figma.com/design/SOAcmeZ1SqIPhaIqzm6Nm3/Recycle-Market---Kelompok-13?node-id=0-1&t=d9WD5m9IUeZOqOj4-1'>
                        <FontAwesomeIcon icon="fa-brands fa-figma" size='2x' />
                    </a>
                </div>
            </section>
        </footer>
    )   
}

export default Footer;