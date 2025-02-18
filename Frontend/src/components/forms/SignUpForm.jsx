import { useRef, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { showInfoToast, showErrorToast } from '../../configs/toastify';

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
                <input
                    type="text"
                    name="regUsername"
                    id="regUsername"
                    ref={userName}
                    placeholder='Enter your username.'
                    className='border-[1px] border-slate-400/80 pl-2'
                    required />
                <label htmlFor="regEmail">Enter your email:</label>
                <input
                    type="email"
                    name="regEmail"
                    id="regEmail"
                    ref={userEmail}
                    placeholder='Enter your email.'
                    className='border-[1px] border-slate-400/80 pl-2'
                    required />
                <label htmlFor="regPass">Enter your password:</label>
                <input
                    type="password"
                    name="regPass"
                    id="regPass"
                    ref={userPass}
                    placeholder='Enter your password.'
                    className='border-[1px] border-slate-400/80 pl-2'
                    required />
                <label htmlFor="repPass">Repeat your password:</label>
                <input
                    type="password"
                    name="repPass"
                    id="repPass"
                    ref={repPass}
                    placeholder='Repeat your password.'
                    className='border-[1px] border-slate-400/80 pl-2'
                    required
                />
                <button
                    type="button"
                    className='w-fit h-fit p-2 border-[1px] border-slate-400/80 rounded-xl'
                    onClick={handleCookiesSettings}
                >
                    Cookies settings
                </button>
                {showCookiesSettings && <div>
                    <p className='text-sm w-full h-fit flex flex-col justify-center text-pretty'>
                        Na tej stronie wykorzystujemy pliki cookies w celu uwierzytelniania użytkowników oraz zbierania anonimowych statystyk
                        dotyczących ruchu i sposobu korzystania ze strony (Google Analytics).
                        <span className='mt-2'>Nie przechowujemy żadnych danych reklamowych ani
                            śledzących. Wybrane ustawienie zostanie zapisane w bazie danych.</span>
                    </p>
                    <div className='w-full h-fit flex flex-col gap-3 mt-2'>
                        <p className='w-full h-fit flex justify-center font-semibold'>Akceptuję:</p>
                        <div className='w-full h-fit flex justify-center gap-3 pl-14'>
                            <button
                                className='w-fit h-fit p-2 border-[1px] border-slate-400/80 rounded-xl'
                                type="button"
                                onClick={() => setCookiesConsent(1)}
                            >
                                Wszystkie
                            </button>
                            <button
                                className='w-fit h-fit p-2 border-[1px] border-slate-400/80 rounded-xl'
                                type="button"
                                onClick={() => setCookiesConsent(0)}
                            >
                                Tylko obowiązkowe
                            </button>
                        </div>
                    </div>
                </div>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className='w-fit h-fit flex justify-self-center border-2 border-slate-300 rounded-xl py-2 px-3'
                >
                    Register
                </button>
            </form>
        </div>
    )
}