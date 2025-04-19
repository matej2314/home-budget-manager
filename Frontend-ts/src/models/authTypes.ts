import { type BaseApiResponse } from "@utils/asyncUtils/fetchData";
import { type ReactNode } from "react";

export type User = {
    id: string;
    userName: string;
    role: string;
    avatar?: string;
    cookiesConsent?: boolean;
};

export type RegisterRequestData = {
    reg_username: string;
    reg_email: string;
    reg_password: string;
    role: string;
    cookies: boolean;
};

export type AuthStatus = {
    message: string;
    error: string;
    isLoading: boolean;
};

export type SessionStatus = {
    error: string;
    isLoading: boolean;
};

export type AuthContextType = {
    isAuthenticated: boolean;
    loginStatus: AuthStatus;
    signUpStatus: AuthStatus;
    sessionStatus: SessionStatus;
    user: User;
    updateUser?: (updates: User) => void;
    register: (data: RegisterRequestData) => Promise<void>;
    login: (data: LoginInputValue) => Promise<void>;
    logout: () => Promise<void>;
    checkSession?: () => Promise<void>;
};

export type AuthProviderProps = {
    children: ReactNode;
};

export type LoginInputValue = {
    email: string;
    password: string;
};

export type LoginResponse = BaseApiResponse & {
    userName: string;
    role: string;
    id: string;
    cookies: boolean;
    avatar: string;
};

export type checkSessionResponse = BaseApiResponse & User;