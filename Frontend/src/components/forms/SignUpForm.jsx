import { useRef, useContext } from 'react';
import { AuthContext } from '../../store/authContext';

export default function SignUpForm() {
    const { register, isLoading, error, message, user } = useContext(AuthContext);

    const userName = useRef();
    const userEmail = useRef();
    const userPass = useRef();
    const repPass = useRef();
    const role = 'user';

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        };

        await register(data);
    };

    return (
        <div className='w-full h-fit flex flex-col justify-center items-center gap-2'>
            <h2 className='text-xl'>Sign up!</h2>
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
                    required />
                <button
                    type="submit"
                    disabled={isLoading}
                    className='w-fit h-fit border-2 border-slate-300 rounded-xl py-2 px-3'
                >
                    Register
                </button>
            </form>
        </div>
    )
}