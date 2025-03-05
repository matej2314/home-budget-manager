import { useRef, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { Icon } from '@iconify/react';
import SignUpCookiesSettings from '../SignUpCookiesSettings';

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
            alert('Hasła muszą być identyczne!');
            return;
        };

        if (userPass.current.value.length < 10) {
            alert('Hasło musi mieć co najmniej 10 znaków!');
            return;
        };

        const specialCharRegex = /[*#!@%^]/;
        if (!specialCharRegex.test(userPass.current.value)) {
            alert('Hasło musi zawierać przynajmniej jeden znak specjalny (*,@,%,!,^)');
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
                        className='border-[1px] border-slate-400/80 pl-2 rounded-md'
                        required
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer text-opacity-60"
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
                        className='border-[1px] border-slate-400/80 pl-2 rounded-md'
                        required
                    />
                    <Icon
                        icon='entypo:email'
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer text-opacity-60"
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
                        className='border-[1px] border-slate-400/80 pl-2 rounded-md'
                        required
                    />
                    <Icon
                        icon='carbon:password'
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer text-opacity-60"
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
                        className='border-[1px] border-slate-400/80 pl-2 rounded-md'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        required
                    />
                    <Icon
                        icon='mdi:password-reset'
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer text-opacity-60"
                    />
                </div>

                <button
                    type="button"
                    className="bg-gray-300/65 text-black p-2 rounded-md border-2 border-slate-600 hover:bg-gray-500 hover:text-slate-300 shadow-sm shadow-slate-600/80 active:shadow"
                    onClick={handleCookiesSettings}
                >
                    Cookies settings
                </button>
                {showCookiesSettings && <SignUpCookiesSettings clickAction={setCookiesConsent} />}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gray-300/65 text-black p-2 rounded-md border-2 border-slate-600 hover:bg-gray-500 hover:text-slate-300 shadow-sm shadow-slate-600/80 active:shadow"
                >
                    Register
                </button>
            </form>
        </div>
    )
}