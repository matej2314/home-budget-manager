import { useState, useRef } from 'react';
import sendRequest from '../../utils/sendRequest';

export default function ContactForm() {
    const [sended, setSended] = useState(false);
    const userNameRef = useRef();
    const userEmailRef = useRef();
    const userMessageRef = useRef();

    const handleContactForm = async (e) => {
        e.preventDefault();
    };
    return (
        <form
            onSubmit={handleContactForm}
            className='w-1/3 h-fit flex flex-col justify-start items-center gap-3 border-2 border-slate-400 bg-slate-400/25 rounded-md py-5 shadow-md shadow-slate-400'
        >
            <h2 className='w-full h-fit flex justify-center items-center font-semibold text-xl mb-3'>Contact us:</h2>
            <label className='w-full h-fit flex justify-center items-center' htmlFor="userName">Type your name:</label>
            <input
                type="text"
                className='w-10/12 h-fit flex justify-center items-center pl-2 rounded-md'
                name="userName"
                id="userName"
                ref={userNameRef}
                required />
            <label htmlFor="userEmail">Type your e-mail address:</label>
            <input
                type="email"
                className='w-10/12 h-fit flex justify-center items-center pl-2 rounded-md'
                name="userEmail"
                id="userEmail"
                ref={userEmailRef}
                required />
            <label className='w-full h-fit flex justify-center items-center' htmlFor="userMessage">Type your message:</label>
            <textarea
                className='w-10/12 h-fit flex justify-center items-center pl-2 resize-none rounded-md'
                name="userMessage"
                id="userMessage"
                rows="10"
                ref={userMessageRef}
                required />
            <button
                type="submit"
                className="bg-gray-300 text-black p-2 rounded-md border-[1px] border-slate-500 hover:bg-gray-400 hover:text-slate-200"
            >Send
            </button>
        </form>
    )
}