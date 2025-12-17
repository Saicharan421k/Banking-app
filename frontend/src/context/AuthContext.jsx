import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const item = localStorage.getItem('user');
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Clear user on logout/token removal
            setUser(null);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
            setToken(response.data.token);
            const userInfo = { username: response.data.username, role: response.data.role };
            setUser(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
            return userInfo;
        } catch (error) {
            console.error("Login failed", error);
            return null;
        }
    };

    const register = async (userData) => {
        try {
            await axios.post('http://localhost:8080/api/auth/register', userData);
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            return false;
        }
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
