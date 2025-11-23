import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

const findAllProducts = async () => {
    try {
        const products = await axios.get(`${API_URL}/api/produk/`);
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

const searchProduct = async (productName) => {
    try {
        const product = await axios.get(`${API_URL}/api/produk/search/${productName}`);
        return product.data;
    } catch (error) {
        throw error;
    }
}

const findRelatedProduct = async (id) => {
    try {
        const product = await axios.get(`${API_URL}/api/produk/toko/${id}`);
        return product.data;
    } catch (error) {
        throw error;
    }
}

const addProduct = async ( formData ) => {
    try {
        const res = await axios.post(
            `${API_URL}/api/produk/add`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        return res.data;
    } catch (error) {
        throw error;
    }
}

const deleteProductById = async (id) => {
    try {
       const res = await axios.delete(`${API_URL}/api/produk/delete/${id}`, {timeout: 60000});
        return res; 
    } catch (error) {
        throw error;
    }
}

export { 
    findAllProducts, 
    findProductId, 
    findProductByCategory, 
    searchProduct,
    findRelatedProduct,
    addProduct,
    deleteProductById
}