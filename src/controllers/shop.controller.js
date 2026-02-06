import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const registerShop = async (data) => {
    try {
        const res = await axios.post(`${API_URL}/api/toko/create`, data);
        return res
    } catch (error) {
        throw error
    }
}

const findShopData = async (id) => {
    try {
        if (!id) {
            return
        }
        const res = await axios.get(`${API_URL}/api/toko/data/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

const findShopDataByUser = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/api/toko/data/user/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export { registerShop, findShopData, findShopDataByUser }