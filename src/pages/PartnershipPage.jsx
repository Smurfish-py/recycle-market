import { 
    ScaleIcon, 
    BuildingStorefrontIcon, 
    CheckBadgeIcon, 
    HeartIcon, 
    UserIcon, 
    IdentificationIcon,
    DocumentTextIcon
} from '@heroicons/react/24/solid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);

import partnerShipImg from '../assets/images/partnership.jpg'

export default function PartnershipPage() {
    return (
        <section className='mt-16 flex justify-center'>
            <div className='w-full sm:w-2/3'>
                <div id='hero' className='relative text-white'>
                    <img src={partnerShipImg} className='h-30 md:h-40 w-full object-cover brightness-75 rounded-t-2xl'/>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 md:w-fit'>
                        <h1 className='font-inter font-semibold text-xl text-left md:text-3xl md:text-center'>GREENSHIFT PARTNERSHIP</h1>
                        <h2 className='text-sm md:text-base'>Oleh Recycle Market</h2>
                    </div>
                </div>
                <hr className='my-2 text-stone-300'/>
                <div id='informationSection' className='flex flex-col gap-8'>
                    <div className='px-2'>
                        <h1 className='text-4xl md:text-4xl font-semibold mb-4'>GREENSHIFT PARTNERSHIP PROGRAM</h1>
                        <p className='mb-4'><span>Greenshift Partnership</span> merupakan program kesepakatan dan kerja sama antara pihak pengaju dengan kami dengan tujuan untuk menjual barang dan berafiliasi dengan kami. Pengguna yang ingin memulai penjualan barang di website ini wajib mendaftar program ini</p>
                        <a className='btn-solid w-fit cursor-pointer'>DAFTAR PARTNERSHIP</a>
                    </div>
                    <div className='px-2'>
                        <h2 className='text-2xl font-semibold mb-3'>Manfaat Menjadi Greenshift</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-2'>
                            <div className='px-2 py-2 flex flex-row items-center gap-4'>
                                <div className='flex-1/6 flex items-center justify-center'>
                                    <BuildingStorefrontIcon className='size-8'/>
                                </div>
                                
                                <h3 className='flex-5/6'>Membuka fitur halaman khusus toko (Halaman ini akan dibuat otomatis dan nama toko akan menyesuaikan dengan nama user saat ini)</h3>
                            </div>
                            <div className='px-2 py-2 flex flex-row items-center gap-4'>
                                <div className='flex-1/6 flex items-center justify-center'>
                                    <CheckBadgeIcon className='size-8'/>
                                </div>
                                
                                <h3 className='flex-5/6'>Badge certified di sebelah nama user yang menunjukkan bahwa anda adalah user tersertifikasi</h3>
                            </div>
                            <div className='px-2 py-2 flex flex-row items-center gap-4'>
                                <div className='flex-1/6 flex items-center justify-center'>
                                    <ScaleIcon className='size-8'/>
                                </div>
                                
                                <h3 className='flex-5/6'>Setelah menjadi partner, anda bisa mulai menjual barang anda sendiri</h3>
                            </div>
                            <div className='px-2 py-2 flex flex-row items-center gap-4'>
                                <div className='flex-1/6 flex items-center justify-center'>
                                    <HeartIcon className='size-8'/>
                                </div>
                                
                                <h3 className='flex-5/6'>Membangun dan meningkatkan kepercayaan dengan calon pembeli dan pembeli</h3>
                            </div>
                        </div>
                    </div>
                    <hr className='text-stone-300'/>
                    <div className='px-2'>
                        <h2 className='text-2xl font-semibold mb-3'>Syarat Menjadi Greenshift</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-2'>
                            <div className='px-2 py-2 flex flex-row items-center gap-4 bg-green-accent'>
                                <div className='flex-1/6 flex items-center justify-center'>
                                    <UserIcon className='size-8'/>
                                </div>
                                
                                <h3 className='flex-5/6'>Pengguna terdaftar setidaknya sudah berumur 13 tahun</h3>
                            </div>
                            <div className='px-2 py-2 flex flex-row items-center gap-4 bg-emerald-50'>
                                <div className='flex-1/6 flex items-center justify-center'>
                                    <IdentificationIcon className='size-8'/>
                                </div>
                                
                                <h3 className='flex-5/6'>Foto KTP sebagai jaminan jika terjadi sesuatu yang tak diinginkan. Pengguna dengan umur dibawah 17 tahun dapat menggunakan KTP wali untuk melengkapi syarat pendaftaran</h3>
                            </div>
                            <div className='px-2 py-2 flex flex-row items-center gap-4 bg-green-accent'>
                                <div className='flex-1/6 flex items-center justify-center'>
                                    <FontAwesomeIcon icon="fa-brands fa-whatsapp" size="2x"/>
                                </div>
                                
                                <h3 className='flex-5/6'>Memiliki nomor WhatsApp Business</h3>
                            </div>
                            <div className='px-2 py-2 flex flex-row items-center gap-4 bg-emerald-50'>
                                <div className='flex-1/6 flex items-center justify-center'>
                                    <DocumentTextIcon className='size-8'/>
                                </div>
                                
                                <h3 className='flex-5/6'>Mengikuti semua kebijakan yang kami berikan kepada anda</h3>
                            </div>
                        </div>
                    </div>
                    <hr className='text-stone-300' />
                    <div className='px-2'>
                        <h2 className='text-2xl font-semibold mb-3'>Sudah Siap Menjadi Greenshift?</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2'>
                            <div className='py-2 mb-4'>
                                <h2 className='text-xl font-semibold'>Perlu Diperhatikan</h2>
                                <p className='mb-4'>Dengan mendaftar, anda setuju untuk memberikan informasi pribadi seperti KTP dan Nomor Telepon WhatsApp anda. Kami tidak akan menjual informasi tersebut dan hanya menggunakannya untuk keperluan pendaftaran partner saja.</p>
                                <div className='grid grid-cols-1 gap-2'>
                                    <a className='btn w-fit cursor-pointer'>Baca Peraturan dan Kebijakan</a>
                                    <a className='btn-solid w-fit cursor-pointer'>DAFTAR PARTNERSHIP</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}