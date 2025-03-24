import { useRef, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import SignUpCookiesSettings from '../SignUpCookiesSettings';
import { isValidUsername, isValidPassword, isNoSQL, isNoXSS, isValidEmail } from '../../utils/validation';
import SubmitBtn from './internal/SubmitBtn';

export default function SignUpForm() {
    const { register, isLoading, error, message, user } = useContext(AuthContext);
    const [sended, setSended] = useState(false);
    const [showCookiesSettings, setShowCookiesSettings] = useState(false);
    const [cookiesConsent, setCookiesConsent] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation("forms");

    const userName = useRef();
    const userEmail = useRef();
    const userPass = useRef();
    const repPass = useRef();
    const role = 'user';

    const handleCookiesSettings = () => {
        setShowCookiesSettings(prevState => !prevState)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSended(false);

        const name = userName.current.value;
        const email = userEmail.current.value;
        const password = userPass.current.value;
        const repeatedPass = repPass.current.value;

        const validUsername = name && isValidUsername(name);
        const validEmail = email && isValidEmail(email);
        const validPassword = password && isValidPassword(password);
        const validRepeatedPass = repeatedPass && isValidPassword(repeatedPass);
        const paswordsMatch = password === repeatedPass;

        if (!validUsername || !validEmail || !validPassword || !validRepeatedPass) {
            showErrorToast(t("signUpForm.inputError"));
            return;
        } else if (!paswordsMatch) {
            showErrorToast(t("signUpForm.passMatchError"));
            return;
        };

        const data = {
            reg_username: name,
            reg_email: email,
            reg_password: password,
            role,
            cookies: cookiesConsent,
        };

        await register(data);
        setSended(() => true);
    };

    useEffect(() => {
        if (sended && message) {
            showInfoToast(message);
            const timer = setTimeout(() => {
                navigate('/');
            }, 600);

            return () => clearTimeout(timer);
        }


        if (sended && error) {
            showErrorToast(error)
        }
    }, [error, message, sended, navigate]);

    return (
        <div className='w-full h-fit flex flex-col justify-center items-center gap-2'>
            <h2 className='text-xl'>{t("signUpForm.heading")}</h2>
            <form onSubmit={handleSubmit} className='w-fit h-fit flex flex-col justify-center items-center gap-3'>
                <label htmlFor="regUsername">{t("signUpForm.nameLabel")}</label>
                <div className='relative w-full'>
                    <input
                        type="text"
                        name="regUsername"
                        id="regUsername"
                        ref={userName}
                        placeholder={t("signUpForm.namePlaceholder")}
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className='auth-input'
                        required
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="absolute right-1 top-0.5 text-gray-500 text-xl pointer-events-none text-opacity-60"
                    />
                </div>
                <label htmlFor="regEmail">{t("signUpForm.emailLabel")}</label>
                <div className='relative w-full'>
                    <input
                        type="email"
                        name="regEmail"
                        id="regEmail"
                        ref={userEmail}
                        placeholder='email'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className='auth-input'
                        required
                    />
                    <Icon
                        icon='entypo:email'
                        className="icon-base top-1 text-gray-500 text-xl text-opacity-60 -translate-y-1"
                    />
                </div>
                <label htmlFor="regPass">{t("signUpForm.passLabel")}</label>
                <div className='relative w-full'>
                    <input
                        type="password"
                        name="regPass"
                        id="regPass"
                        ref={userPass}
                        placeholder={t("signUpForm.passPlaceholder")}
                        className='auth-input'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        required
                    />
                    <Icon
                        icon='carbon:password'
                        className="icon-base top-1 text-gray-500 text-xl text-opacity-60 -translate-y-1"
                    />
                </div>

                <label htmlFor="repPass">{t("signUpForm.repPassLabel")}</label>
                <div className='relative w-full'>
                    <input
                        type="password"
                        name="repPass"
                        id="repPass"
                        ref={repPass}
                        placeholder={t("signUpForm.repPassPlaceholder")}
                        className='auth-input'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        required
                    />
                    <Icon
                        icon='mdi:password-reset'
                        className="icon-base top-1.5 text-gray-500 text-xl pointer-events-none text-opacity-60 -translate-y-1"
                    />
                </div>

                <button
                    type="button"
                    className="form-submit-modal-btn"
                    onClick={handleCookiesSettings}
                >
                    {t("signUpForm.cookiesSettingsBtn")}
                </button>
                {showCookiesSettings && <SignUpCookiesSettings clickAction={setCookiesConsent} />}
                <SubmitBtn
                    className='auth-submit-btn'
                    disabled={isLoading}
                >
                    {t("signUpForm.submitBtn")}
                </SubmitBtn>
            </form>
        </div>
    )
}