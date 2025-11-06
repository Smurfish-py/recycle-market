import { jwtDecode } from "jwt-decode"

export default function isTokenExpired(token) {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        return decoded.exp < currentTime;
    } catch (error) {
        throw error;
    }
}