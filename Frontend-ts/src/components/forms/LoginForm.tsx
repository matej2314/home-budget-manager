import { useRef, useContext, useState, FormEvent } from 'react';
import { AuthContext } from '../../store/authContext';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { showErrorToast } from '../../configs/toastify';
import { isValidPassword,isValidEmail } from '../../utils/validation';
import LoadingModal from '../modals/LoadingModal';
import SubmitBtn from './internal/SubmitBtn';
import { AuthContextType } from '@models/authTypes';

export default function LoginForm() {
    const { login, loginStatus } = useContext(AuthContext) as AuthContextType;
    const [sended, setSended] = useState<boolean>(false);
    const { t } = useTranslation("forms");
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSended(false);

        const userEmail = email.current?.value;
        const userPassword = password.current?.value;

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
                        onInput={(e: FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            const icon = input.nextSibling as HTMLElement;
                            icon.style.display = input.value ? 'none' : 'block';
                          }}
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
                        onInput={(e: FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            const icon = input.nextSibling as HTMLElement;
                            icon.style.display = input.value ? 'none' : 'block';
                          }}
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