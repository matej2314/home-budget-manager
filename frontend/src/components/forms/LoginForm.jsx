import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../store/authContext';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { showErrorToast, showInfoToast } from '../../configs/toastify';
import { resolveApiMessage } from '../../utils/asyncUtils/parseApiEnvelope';
import { isValidPassword, isValidEmail } from '../../utils/validation';
import LoadingModal from '../modals/LoadingModal';
import SubmitBtn from './internal/SubmitBtn';

export default function LoginForm() {
    const { login, loginStatus } = useAuth();
    const [sended, setSended] = useState(false);
    const { t } = useTranslation("forms");
    const email = useRef();
    const password = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSended(false);

        const userEmail = email.current.value;
        const userPassword = password.current.value;

        const validUserEmail = userEmail && isValidEmail(userEmail);
        const validUserPassword = userPassword && isValidPassword(userPassword);

        if (!validUserEmail || !validUserPassword) {
            showErrorToast(t("loginForm.invalidInput"));
            return;
        }

        const data = {
            email: userEmail,
            password: userPassword,
        };

        await login(data);
        setSended(true);
    };

    useEffect(() => {
        if (!sended || loginStatus.isLoading) return;
        if (loginStatus.message) {
            showInfoToast(resolveApiMessage(loginStatus.message));
        }
        if (loginStatus.error) {
            showErrorToast(resolveApiMessage(loginStatus.error));
        }
    }, [sended, loginStatus]);

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
                    disabled={sended && loginStatus.isLoading}
                >
                    {sended && loginStatus.isLoading ? t("loginForm.isLoadingBtn") : t("loginForm.submitBtn")}
                </SubmitBtn>
            </form>
            {loginStatus.isLoading && <LoadingModal isOpen={loginStatus.isLoading} />}
        </div>
    )

}