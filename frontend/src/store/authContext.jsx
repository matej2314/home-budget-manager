import { createContext, useState, useEffect, useContext, useRef, useCallback } from "react";
import sendRequest from '../utils/asyncUtils/sendRequest';
import fetchData from "../utils/asyncUtils/fetchData";
import { registerAuthFailureHandlers } from '../utils/asyncUtils/authFailureBridge';
import { showErrorToast } from '../configs/toastify';
import { apiBaseUrl } from '../url';
import i18n from '../configs/i18n';
import { resolveApiMessage } from '../utils/asyncUtils/parseApiEnvelope';

export const AuthContext = createContext();

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};

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

    const register = async (data) => {
        setSignUpStatus({ error: null, isLoading: true, message: null });
        try {
            const response = await sendRequest('POST', data, `${apiBaseUrl}/auth/signup`);

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
            const response = await sendRequest('POST', data, `${apiBaseUrl}/auth/login`);

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
            const response = await sendRequest('POST', {}, `${apiBaseUrl}/auth/logout`);

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
            // często 401 przy już martwej sesji — i tak czyść lokalny stan
            setIsAuthenticated(false);
            setUser({
                id: '',
                userName: '',
                role: '',
                avatar: '',
                cookiesConsent: false,
            });
            setLoginStatus((prev) => ({ ...prev, error: error.message }));
        } finally {
            setLoginStatus((prev) => ({ ...prev, isLoading: false }));
        };
    };

    const logoutRef = useRef(logout);
    logoutRef.current = logout;
    const isAuthenticatedRef = useRef(isAuthenticated);
    isAuthenticatedRef.current = isAuthenticated;

    const checkSession = useCallback(async () => {
        setSessionStatus({ error: null, isLoading: true });
        try {
            const response = await fetchData(`${apiBaseUrl}/auth/verify`);

            if (response && response.status === 'success') {
                setUser((prevUser) => ({
                    ...prevUser,
                    userName: response.userName,
                    role: response.role,
                    id: response.userId,
                    avatar: response.avatar,
                }));
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
    }, []);


    useEffect(() => {
        checkSession();
    }, [checkSession]);

    useEffect(() => {
        registerAuthFailureHandlers({
            onUnauthorized: async (messageKey) => {
                // checkSession /auth/verify bez cookie też jest 401 — bez toasta dla gościa
                if (!isAuthenticatedRef.current) return;
                showErrorToast(messageKey || 'Session expired');
                await logoutRef.current();
            },
            onForbidden: (messageKey) => {
                // 403 z API (np. authz.*) — widoczny toast i18n; SoT nadal middleware
                showErrorToast(
                    resolveApiMessage(
                        (key, opts) => i18n.t(key, { ns: 'common', ...opts }),
                        messageKey,
                        messageKey || 'Forbidden',
                    ),
                );
            },
        });
    }, []);

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated, loginStatus, signUpStatus, sessionStatus,
            register, login, logout, checkSession,
        }}>
            {children}
        </AuthContext.Provider>
    )
}