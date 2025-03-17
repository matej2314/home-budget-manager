import { useRef, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';
import SubmitBtn from './internal/SubmitBtn';


export default function LoginForm() {
    const { login, isLoading, error, message, user, isAuthenticated } = useContext(AuthContext);
    const [sended, setSended] = useState(false);
    const { t } = useTranslation("forms");
    const navigate = useNavigate();
    const email = useRef();
    const password = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSended(false);

        const data = {
            email: email.current.value,
            password: password.current.value,
        };

        await login(data);
        setSended(true);
    };

    useEffect(() => {
        if (user && !isLoading && !error && isAuthenticated) {
            showInfoToast(`${user.userName} ${t("loginForm.correctLogin")}`);
            const timer = setTimeout(() => {
                navigate('/dashboard');
            }, 600);

            return () => clearTimeout(timer);
        };

        if (sended && error && !isAuthenticated) {
            showErrorToast(t("loginForm.failedLogin"));
        }
    }, [error, isLoading, navigate, user]);

    return (
        <div className='w-full h-fit flex flex-col justify-center items-center gap-2'>
            <h2 className='text-xl'>{t("loginForm.heading")}</h2>
            <form onSubmit={handleSubmit} className='w-fit h-fit flex flex-col justify-center items-center gap-3'>
                <label htmlFor="email">Email:</label>
                <div className='relative w-full'>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        ref={email}
                        placeholder='email'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className='auth-input'
                        required
                    />
                    <Icon
                        icon='wpf:name'
                        width={15}
                        className="icon-base top-1 text-gray-500 text-xl text-opacity-45"
                    />
                </div>
                <label htmlFor="password">{t("loginForm.passLabel")}</label>
                <div className='relative w-full'>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        ref={password}
                        placeholder='password'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className='auth-input'
                        required
                    />
                    <Icon
                        icon='carbon:password'
                        width={15}
                        className="icon-base top-1 text-gray-500 text-xl text-opacity-80"
                    />
                </div>
                <SubmitBtn
                    className="auth-submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? t("loginForm.isLoadingBtn") : t("loginForm.submitBtn")}
                </SubmitBtn>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </div>
    )

}