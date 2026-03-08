import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateShop, findShopData } from "@/controllers/shop.controller";

import placeholder from '@/assets/images/login-illustration.png';

const API_URL = import.meta.env.VITE_API_URL;

export default function shopEdit() {
    const { id } = useParams();

    const [pfp, setPfp] = useState(null);
    const [banner, setBanner] = useState(null);
    const [shop, setShop] = useState(null);
    const [previewPfp, setPreviewPfp] = useState(null);
    const [previewBanner, setPreviewBanner] = useState(null);

    useEffect(() => {
        const shopData = async (shopId) => {
            const res = await findShopData(shopId);
            setShop(res);
        }

        shopData(id);
    }, []);

    async function handleFileChangePfp(e) {
        setPfp(e.target.files[0]);
        setPreviewPfp(URL.createObjectURL(e.target.files[0]));
    }
    async function handleFileChangeBanner(e) {
        setBanner(e.target.files[0]);
        setPreviewBanner(URL.createObjectURL(e.target.files[0]));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { deskripsi } = e.target;

        const formData = new FormData();

        formData.append('pfp', pfp);
        formData.append('banner', banner);
        formData.append('deskripsi', deskripsi.value);

        try {
            const res = await updateShop(id, formData);
            console.log(res);
            window.location = `/shop/${id}`
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mt-16 flex items-center justify-center w-full h-full">
            <form className="border border-stone-300 min-w-100 w-fit px-4 py-2 rounded-md" onSubmit={handleSubmit}>
                <h2 className="text-center text-xl font-semibold">Edit Informasi Toko</h2><br />
                <label htmlFor="nama" className="font-semibold">Nama</label> <br />
                <input className="border border-stone-300 cursor-not-allowed min-h-6 input-text w-full bg-stone-200 text-stone-500" type="text" id="nama" defaultValue={shop?.nama} disabled /><br />
                <label htmlFor="deskripsi" className="font-semibold">Deskripsi Toko</label> <br />
                <textarea className="input-text min-h-10 w-full"id="deskripsi" name="deskripsi" defaultValue={shop?.deskripsi}></textarea>
                <hr className="my-2" />
                <div className="flex flex-col [&_p]:text-lg [&_p]:font-semibold">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <p>Foto Profil Toko</p>
                            <fieldset className="border border-gray-400 rounded-md min-h-25 mb-2 p-2 min-w-80 flex items-center justify-center">
                                <img src={shop?.filePfp ? `${API_URL}/api/images/users/shop/pfp/${shop?.filePfp}` : placeholder} />
                            </fieldset>
                        </div>
                        <div className="flex-1">
                            <p>Preview Foto Profil Toko</p>
                            <fieldset className="border border-gray-400 rounded-md min-h-25 mb-2 p-2 min-w-80 flex items-center justify-center">
                                { !previewPfp ? (
                                    <h4 className="text-center font-semibold opacity-60">Tidak ada file yang diupload</h4>
                                ) : (
                                    <img src={previewPfp} />
                                ) }
                                
                            </fieldset>
                        </div>
                    </div>
                    <label htmlFor="pfp" className="block btn w-full text-center cursor-pointer">Upload foto profil toko</label>
                    <input name="pfp" type="file" accept="image/*" id="pfp" onChange={handleFileChangePfp} className="hidden" /><br />
                </div><br />
                <div className="[&_p]:text-lg [&_p]:font-semibold">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <p>Foto Profil Toko</p>
                            <fieldset className="border border-gray-400 rounded-md min-h-25 mb-2 p-2 min-w-80 flex items-center justify-center">
                                <img src={`${API_URL}/api/images/users/shop/banner/${shop?.fileBanner}`} />
                            </fieldset>
                        </div>
                        <div className="flex-1">
                            <p>Preview Foto Banner Toko</p>
                            <fieldset className="border border-gray-400 rounded-md min-h-25 mb-2 p-2 min-w-80 flex items justify-center">
                                { !previewBanner ? (
                                    <h4 className="text-center font-semibold opacity-60">Tidak ada file yang diupload</h4>
                                ) : (
                                    <img src={previewBanner} />
                                ) }
                            </fieldset>
                        </div>
                    </div>
                    <label htmlFor="banner" className="block btn w-full text-center cursor-pointer">Upload banner toko</label>
                    <input name="banner" type="file" accept="image/*" id="banner" onChange={handleFileChangeBanner} className="hidden" />
                </div>
                <hr className="my-2" />
                <button type="submit" className="btn-solid w-full cursor-pointer">Update</button>
            </form>
        </div>
    )
}