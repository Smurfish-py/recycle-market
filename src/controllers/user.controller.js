import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const handleLogin = async ( email, password ) => {
    try {
        const res = await axios.post(`${API_URL}/api/user/login`, { email, password });
        const token = res.data.token;
        const pesan = res.data.pesan;

        if (pesan) {
            throw pesan;
        }

        return token;

    } catch (error) {
        throw error?.response?.data?.pesan;
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

const userData = async ( id ) => {
    try {
        const res = await axios.get(`${API_URL}/api/user/data/${id}`);
        return res;
    } catch (error) {
        throw error
    }
}

const findAllUsers = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/user/`);
        return res;
    } catch (error) {
        throw error;
    }
}

const countUsers = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/user/count`);
        return res
    } catch (error) {
        throw error
    }
}

const protectedPage = ( allowedPrivilege, userPrivilege ) => {
    if (allowedPrivilege.includes(userPrivilege)) {
        return true;
    } else {
        return false;
    }
}

export { 
    handleLogin, 
    handleRegister, 
    userData, 
    protectedPage, 
    findAllUsers,
    countUsers
}