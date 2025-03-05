import { useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { Icon } from '@iconify/react';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';


export default function LoginForm() {
    const { login, isLoading, error, message, user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const email = useRef();
    const password = useRef();
    const disabledValue = isLoading || isAuthenticated;


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabledValue) {
            showInfoToast('You are currently logged in!');
            return;
        };

        const data = {
            email: email.current.value,
            password: password.current.value,
        };

        await login(data);
    };

    useEffect(() => {
        if (user && !isLoading && !error) {
            showInfoToast(`User ${user.userName} logged in successfully!`);
            const timer = setTimeout(() => {
                navigate('/dashboard');
            }, 600);

            return () => clearTimeout(timer);
        };

        if (message || error) {
            showErrorToast(message);
        }
    }, [error, isLoading, navigate, user]);

    return (
        <div className='w-full h-fit flex flex-col justify-center items-center gap-2'>
            <h2 className='text-xl'>Login</h2>
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
                        className='border-b-[1px] border-slate-400/80 pl-2  shadow-sm shadow-slate-500 text-slate-900 placeholder-slate-800/45 rounded-md'
                        required
                    />
                    <Icon
                        icon='wpf:name'
                        width={15}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer text-opacity-45"
                    />
                </div>
                <label htmlFor="password">Password:</label>
                <div className='relative w-full'>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        ref={password}
                        placeholder='password'
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className='border-b-[1px] border-slate-400/80 pl-2  shadow-sm shadow-slate-500 text-slate-900 placeholder-slate-800/45 rounded-md'
                        required
                    />
                    <Icon
                        icon='carbon:password'
                        width={15}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer text-opacity-80"
                    />
                </div>

                <button
                    type="submit"
                    disabled={disabledValue}
                    className="bg-gray-300 text-black p-2 rounded-md border-2 border-slate-600 hover:bg-gray-500 hover:text-slate-300 shadow-sm shadow-slate-700 active:shadow"
                >
                    {isLoading ? 'Logging in' : 'Login'}
                </button>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </div>
    )

}