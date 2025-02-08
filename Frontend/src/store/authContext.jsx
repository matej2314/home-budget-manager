import { createContext, useState, useEffect } from "react";
import sendRequest from '../utils/sendRequest';
import fetchData from "../utils/fetchData";
import { serverUrl } from '../url';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);

    const register = async (data) => {
        setError(null);
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await sendRequest('POST', data, `${serverUrl}/auth/signup`);

            if (response) {
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
                setUser({ userName: response.userName, role: response.role, id: response.id, avatar: response.avatar });
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
        setError(null);
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await sendRequest('POST', {}, `${serverUrl}/auth/logout`);

            if (response.status === 'success') {
                setMessage(response.message);
                setIsAuthenticated(false);
                setUser({});
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

            if (response.status === 'success') {
                setUser({ userName: response.userName, role: response.role, id: response.userId, avatar: response.avatar });
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
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