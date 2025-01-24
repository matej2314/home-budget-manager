import { createContext, useState, useEffect } from "react";
import sendRequest from '../utils/sendRequest';
import fetchData from "../utils/fetchData";
import { serverUrl } from '../url';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState(null);
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
            setUser(response);
            setMessage(response.message);
            setIsAuthenticated(true);

        } catch (error) {
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

            if (response) {
                setMessage(response.message);
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

            if (response) {
                setUser(response);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        };
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

export default AuthProvider;