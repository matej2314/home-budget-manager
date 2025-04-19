import { createContext, useState, useEffect } from "react";
import sendRequest from "@utils/asyncUtils/sendRequest";
import { type User } from "@models/authTypes";
import { type AuthStatus, SessionStatus, AuthContextType, AuthProviderProps, LoginInputValue, LoginResponse,checkSessionResponse, RegisterRequestData } from "@models/authTypes";
import { type BaseApiResponse } from "@utils/asyncUtils/fetchData";
import fetchData from "@utils/asyncUtils/fetchData";
import { serverUrl } from "url";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loginStatus, setLoginStatus] = useState<AuthStatus>({ message: '', error: '', isLoading: false });
    const [signUpStatus, setSignUpStatus] = useState<AuthStatus>({ message: '', error: '', isLoading: false });
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>({ error: '', isLoading: false });
    const [user, setUser] = useState<User>({
        id: '',
        userName: '',
        role: '',
        avatar: '',
        cookiesConsent: false
    });

    const updateUser = (updates: User): void => {
        setUser((prevUser: User) => {
            return { ...prevUser, ...updates };
        });
};

const emptyUser: User = { id: '', userName: '', role: '', avatar: '', cookiesConsent: false };

    const register = async (data: RegisterRequestData): Promise<void> => {

        const newUserData = data;

        setSignUpStatus({ message: '', error: '', isLoading: true });
        try {
            const response = await sendRequest<RegisterRequestData, BaseApiResponse>('POST', newUserData, `${serverUrl}/auth/signup`);

            if (response.status === 'error') {
                setSignUpStatus((prev) => ({ ...prev, error: response.message }));
            } else if (response.status === 'success') {
                setSignUpStatus((prev) => ({ ...prev, message: response.message, error: '' }));
            }
        } catch (error: unknown) {
            const err = error as Error;
            setSignUpStatus((prev) => ({ ...prev, error: err.message }))
        } finally {
            setSignUpStatus((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const login = async (data: LoginInputValue) => {
        setLoginStatus({ error: '', isLoading: true, message: '' });

        try {
            const response = await sendRequest<LoginInputValue, LoginResponse>('POST', {email: data.email, password: data.password}, `${serverUrl}/auth/login`);

            if (response.status === 'success') {
                updateUser({
                    id: response.id,
                    userName: response.userName,
                    role: response.role,
                    avatar: response.avatar,
                    cookiesConsent: response.cookies,
                });
                setIsAuthenticated(true);
                setLoginStatus((prev) => ({ ...prev, message: response.message, error: '' }));
            } else if (response.status === 'error') {
                setLoginStatus((prev) => ({ ...prev, error: response.message }));
            }
        } catch (error: unknown) {
            setIsAuthenticated(false);
            const err = error as Error;
            setLoginStatus((prev) => ({ ...prev, error: err.message }))
        } finally {
            setLoginStatus((prev) => ({ ...prev, isLoading: false }));
        };
    };

    const logout = async () => {
        setLoginStatus({ error: '', isLoading: true, message: '' });

        try {
            const response = await sendRequest < {}, BaseApiResponse>('POST', {}, `${serverUrl}/auth/logout`);
            
            if (response.status === 'success') {
                setIsAuthenticated(false);
                setUser(emptyUser);
                setLoginStatus((prev) => ({ ...prev, message: response.message }));
            };
        } catch (error: unknown) {
            const err = error as Error;
            setLoginStatus((prev) => ({ ...prev, error: err.message }));
        } finally {
            setLoginStatus((prev) => ({ ...prev, isLoading: false }));
        };
    };

    const checkSession = async () => {
        setSessionStatus({ error: '', isLoading: true });

        try {
            const response = await fetchData<checkSessionResponse>(`${serverUrl}/auth/verify`);

            if (response && response.status === 'success') {
                updateUser({
                    userName: response.userName,
                    role: response.role,
                    id: response.id,
                    avatar: response.avatar
                });
                setIsAuthenticated(true);
                setSessionStatus((prev) => ({ ...prev, error: '', isLoading: false }))
            } else {
                setIsAuthenticated(false);
                setUser(emptyUser);
            }
        } catch (error) {
            const err = error as Error;
            setSessionStatus((prev) => ({ ...prev, error: err.message }));
        } finally {
            setSessionStatus((prev) => ({ ...prev, isLoading: false }));
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    const contextValue: AuthContextType = {
        isAuthenticated,
        loginStatus,
        signUpStatus,
        sessionStatus,
        user,
        login,
        register,
        logout,
        updateUser,
        checkSession
    };

    return (
        <AuthContext.Provider value={ contextValue}>
        {children}
        </AuthContext.Provider>
    )
}