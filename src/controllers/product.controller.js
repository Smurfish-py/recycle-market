import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

const findAllProducts = async () => {
    try {
        const products = await axios.get(`${API_URL}/api/produk`);
        return products;
    } catch (error) {   
        console.error({ error: error });
    }
}

const findProductId = async (id) => {
    try {
        const product = await axios.get(`${API_URL}/api/produk/data/${id}`);
        return product;
    } catch (error) {
        console.error({error: error});
    }
}

const findProductByCategory = async (category) => {
    try {
        const product = await axios.get(`${API_URL}/api/produk/kategori/${category}`);
        return product;
    } catch (error) {
        throw error;
    }
}

export { findAllProducts, findProductId, findProductByCategory }