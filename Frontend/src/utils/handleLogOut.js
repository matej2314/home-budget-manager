import { showInfoToast, showErrorToast } from "../configs/toastify";

export const loggingOut = async (logout, navigate) => {
    try {
        await logout();
        showInfoToast('Użytkownik wylogowany!');
        setTimeout(() => {
            navigate('/');
        }, 600);

    } catch (error) {
        showErrorToast(`Błąd wylogowania: ${error.message}`);
    }
};