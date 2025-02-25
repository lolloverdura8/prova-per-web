import { createContext, useContext, useState, useEffect, Children } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        axios.get("http://localhost:3000/api/users/profile", {
            withCredentials: true,
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