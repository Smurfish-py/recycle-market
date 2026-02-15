import { jwtDecode } from "jwt-decode"

export default function isTokenExpired(token) {
    try {
        const decoded = token ? jwtDecode(token) : null;
        const currentTime = Date.now() / 1000;
        
        if (decoded) {
            if (decoded < currentTime) {
                return true;
            } else {
                return false
            }
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}