import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getUserTransactionHistory = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/api/histori-transaksi/${userId}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}