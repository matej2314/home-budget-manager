import { createContext, useState, useEffect } from "react";
import sendRequest from '../utils/asyncUtils/sendRequest';
import fetchData from "../utils/asyncUtils/fetchData";
import { serverUrl } from '../url';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState({
        id: '',
        userName: '',
        role: '',
        avatar: '',
        cookiesConsent: false
    });
    const [error, setError] = useState(null);

    const updateUser = (updates) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updates,
        }));
    };

    const register = async (data) => {
        setError(null);
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await sendRequest('POST', data, `${serverUrl}/auth/signup`);

            if (response.status === 'success') {
                setMessage(response.message);
            };

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        };
    };

    const login = async (data) => {
        setError(null);
        setIsAuthenticated(false);
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await sendRequest('POST', data, `${serverUrl}/auth/login`);

            if (response.status === 'success') {
                updateUser({
                    id: response.id,
                    userName: response.userName,
                    role: response.role,
                    avatar: response.avatar,
                    cookiesConsent: response.cookies,
                });
                setIsAuthenticated(true);
                setMessage(response.message);
            };
        } catch (error) {
            setIsAuthenticated(false);
            setError(error.message);
        } finally {
            setIsLoading(false);
        };
    };

    const logout = async () => {
        setError(() => null);
        setIsLoading(true);
        setMessage(() => null);
        try {
            const response = await sendRequest('POST', {}, `${serverUrl}/auth/logout`);

            if (response.status === 'success') {
                setMessage(() => response.message);
                setIsAuthenticated(false);
                setUser({
                    id: '',
                    userName: '',
                    role: '',
                    avatar: '',
                    cookiesConsent: false,
                });
            };

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        };
    };

    const checkSession = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetchData(`${serverUrl}/auth/verify`);

            if (response && response.status === 'success') {
                updateUser({
                    userName: response.userName,
                    role: response.role,
                    id: response.userId,
                    avatar: response.avatar,
                });
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser({
                    id: '',
                    userName: '',
                    role: '',
                    avatar: '',
                    cookiesConsent: false,
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, message, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}