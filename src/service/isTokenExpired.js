import { jwtDecode } from "jwt-decode"

export default function isTokenExpired(token) {
    try {
        if (!token) return true;

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; 
        
        if (decoded.exp && decoded.exp < currentTime) {
            return true; 
        }
        
        return false;
    } catch (error) {
        return true;
    }
}