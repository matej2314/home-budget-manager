import { useRef, useContext } from 'react';
import { AuthContext } from '../../store/authContext';


export default function LoginForm() {
    const { login, isLoading, error, message, user } = useContext(AuthContext);

    const email = useRef();
    const password = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email: email.current.value,
            password: password.current.value,
        };

        await login(data);
    }


    return (
        <div className='w-full h-fit flex flex-col justify-center items-center gap-2'>
            <h2 className='text-xl'>Login</h2>
            {error && !message && <p className='text-red-600'>{error}</p>}
            {message && <p className='text-green-500'>{message}</p>}
            <form onSubmit={handleSubmit} className='w-fit h-fit flex flex-col justify-center items-center gap-3'>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    ref={email}
                    placeholder='Enter your email'
                    className='border-[1px] border-slate-400/80 pl-2'
                    required />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    ref={password}
                    placeholder='Enter your password'
                    className='border-[1px] border-slate-400/80 pl-2'
                    required />
                <button
                    type="submit"
                    disabled={isLoading}
                    className='w-fit h-fit border-2 border-slate-300 rounded-2xl py-2 px-3'
                >
                    {isLoading ? 'Logging in' : 'Login'}
                </button>
            </form>
        </div>
    )

}