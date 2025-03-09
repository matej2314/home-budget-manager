import { useRef, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { Icon } from '@iconify/react';
import SignUpCookiesSettings from '../SignUpCookiesSettings';
import SubmitBtn from './internal/SubmitBtn';

export default function SignUpForm() {
    const { register, isLoading, error, message, user } = useContext(AuthContext);
    const [sended, setSended] = useState(false);
    const [showCookiesSettings, setShowCookiesSettings] = useState(false);
    const [cookiesConsent, setCookiesConsent] = useState(null);
    const navigate = useNavigate();

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

        if (userPass.current.value !== repPass.current.value) {
            showErrorToast('Passwords must match!');
            return;
        };

        if (userPass.current.value.length < 10) {
            showErrorToast('The password must be at least 10 characters long!');
            return;
        };

        const specialCharRegex = /[*#!@%^]/;
        if (!specialCharRegex.test(userPass.current.value)) {
            showErrorToast('Password must contain at least one special character(*, @,%, !,^)');
            return;
        }

        const data = {
            reg_username: userName.current.value,
            reg_email: userEmail.current.value,
            reg_password: userPass.current.value,
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
            <h2 className='text-xl'>Sign up</h2>
            <form onSubmit={handleSubmit} className='w-fit h-fit flex flex-col justify-center items-center gap-3'>
                <label htmlFor="regUsername">Enter your username:</label>
                <div className='relative w-full'>
                    <input
                        type="text"
                        name="regUsername"
                        id="regUsername"
                        ref={userName}
                        placeholder='username'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className='auth-input'
                        required
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="absolute right-1 top-0.5 text-gray-500 text-xl pointer-events-none text-opacity-60"
                    />
                </div>
                <label htmlFor="regEmail">Enter your email:</label>
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
                <label htmlFor="regPass">Enter your password:</label>
                <div className='relative w-full'>
                    <input
                        type="password"
                        name="regPass"
                        id="regPass"
                        ref={userPass}
                        placeholder='password'
                        className='auth-input'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        required
                    />
                    <Icon
                        icon='carbon:password'
                        className="icon-base top-1 text-gray-500 text-xl text-opacity-60 -translate-y-1"
                    />
                </div>

                <label htmlFor="repPass">Repeat your password:</label>
                <div className='relative w-full'>
                    <input
                        type="password"
                        name="repPass"
                        id="repPass"
                        ref={repPass}
                        placeholder='repeat password'
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
                    Cookies settings
                </button>
                {showCookiesSettings && <SignUpCookiesSettings clickAction={setCookiesConsent} />}
                <SubmitBtn
                    className='auth-submit-btn'
                    disabled={isLoading}
                >
                    Register
                </SubmitBtn>
            </form>
        </div>
    )
}