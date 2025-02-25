import { createContext, useContext, useState, useEffect, Children } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return;
        }

        axios.get("http://0.0.0.0:3000/api/users/profile", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            setUser(response.data);
        }).catch(() => setUser(null))
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);