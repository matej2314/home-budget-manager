import { showInfoToast, showErrorToast } from "@configs/toastify";

export const loggingOut = async (logout: () => Promise<void>, navigate: (path: string) => void): Promise<void> => {
    try {
        await logout();
        showInfoToast("User logged out correctly");
        setTimeout(() => {
            navigate('/');
        }, 600);
    } catch (error) {
        showErrorToast("Failed to log out.");
    }
};