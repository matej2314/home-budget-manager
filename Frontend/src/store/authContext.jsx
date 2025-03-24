import { createContext, useState, useEffect } from "react";
import sendRequest from '../utils/asyncUtils/sendRequest';
import fetchData from "../utils/asyncUtils/fetchData";
import { serverUrl } from '../url';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginStatus, setLoginStatus] = useState({ message: null, error: null, isLoading: false });
    const [signUpStatus, setSignUpStatus] = useState({ message: null, error: null, isLoading: false });
    const [sessionStatus, setSessionStatus] = useState({ error: null, isLoading: false });
    const [user, setUser] = useState({
        id: '',
        userName: '',
        role: '',
        avatar: '',
        cookiesConsent: false
    });

    const updateUser = (updates) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updates,
        }));
    };

    const emptyUser = { id: '', userName: '', role: '', avatar: '', cookiesConsent: false };

    const register = async (data) => {
        setSignUpStatus({ error: null, isLoading: true, message: null });
        try {
            const response = await sendRequest('POST', data, `${serverUrl}/auth/signup`);

            if (response.status === 'error') {
                setSignUpStatus((prev) => ({ ...prev, error: response.message }));
            } else if (response.status === 'success') {
                setSignUpStatus((prev) => ({ ...prev, message: response.message, error: null }));
            }

        } catch (error) {
            setSignUpStatus((prev) => ({ ...prev, error: error.message }));
        } finally {
            setSignUpStatus((prev) => ({ ...prev, isLoading: false }))
        };
    };

    const login = async (data) => {
        setLoginStatus({ error: null, isLoading: true, message: null });

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
                setLoginStatus((prev) => ({ ...prev, message: response.message, error: null }));
            } else if (response.status === 'error') {
                setLoginStatus((prev) => ({ ...prev, error: response.message }));
            }
        } catch (error) {
            setIsAuthenticated(false);
            setLoginStatus((prev) => ({ ...prev, error: error.message }));
        } finally {
            setLoginStatus((prev) => ({ ...prev, isLoading: false }));
        };
    };

    const logout = async () => {
        setLoginStatus({ error: null, isLoading: true, message: null });

        try {
            const response = await sendRequest('POST', {}, `${serverUrl}/auth/logout`);

            if (response.status === 'success') {
                setIsAuthenticated(false);
                setUser({
                    id: '',
                    userName: '',
                    role: '',
                    avatar: '',
                    cookiesConsent: false,
                });
                setLoginStatus((prev) => ({ ...prev, message: response.message }));
            };

        } catch (error) {
            setLoginStatus((prev) => ({ ...prev, error: error.message }));
        } finally {
            setLoginStatus((prev) => ({ ...prev, isLoading: false }));
        };
    };

    const checkSession = async () => {
        setSessionStatus({ error: null, isLoading: true });
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
                setSessionStatus((prev) => ({ ...prev, error: null, isLoading: false }));
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
            setSessionStatus((prev) => ({ ...prev, error: error.message }));
        } finally {
            setSessionStatus((prev) => ({ ...prev, isLoading: false }));
        }
    };


    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated, loginStatus, signUpStatus, sessionStatus, register, login, logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}