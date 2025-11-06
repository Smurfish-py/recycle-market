import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const handleLogin = async ( email, password ) => {
    try {
        const res = await axios.post(`${API_URL}/api/user/login`, { email, password });
        const token = res.data.token;
        const error = res.data.pesan;

        if (!token) {
            throw error?.response?.data.pesan;
        }

        return token;
    } catch (error) {
        if (error) {
            throw error?.response?.data.pesan;
        }

        throw new Error("Terjadi kesalahan saat login, silakan coba lagi.");
    }
}

const handleRegister = async ( fullname, email, password, reTypePassword ) => {
    try {
        if (!fullname || !email || !password || !reTypePassword) return { pesan: "Input masih ada yang kosong!" };
        if (password !== reTypePassword || reTypePassword !== password) return {pesan: "Password dan Re-type Password tidak sama!"};

        const res = await axios.post(`${API_URL}/api/user/register`, { fullname, email, password });
        
        if (!res) {
            throw "Gagal membuat akun";
        }

        return res;
    } catch (error) {
        throw error?.response?.data;
    }
}
export { handleLogin, handleRegister }