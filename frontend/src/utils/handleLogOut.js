import { showInfoToast, showErrorToast } from "../configs/toastify";


export const loggingOut = async (logout, navigate) => {

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