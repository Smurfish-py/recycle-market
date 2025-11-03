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

export { findAllProducts, findProductId }