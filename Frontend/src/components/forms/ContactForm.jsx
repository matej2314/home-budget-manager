import { useState, useRef } from 'react';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast } from '../../configs/toastify';

export default function ContactForm() {
    const [sended, setSended] = useState(false);
    const userNameRef = useRef();
    const userEmailRef = useRef();
    const userMessageRef = useRef();

    const handleContactForm = async (e) => {
        e.preventDefault();
        showInfoToast('Jeszcze nie działa :)');
    };
    return (
        <form
            onSubmit={handleContactForm}
            className='w-9/12 text-sm indirect:w-9/12 indirect:text-base indirectxl:w-8/12 md:w-1/3 h-fit flex flex-col justify-start items-center bg-slate-300/15 gap-3 border-2 border-slate-300 text-slate-200 shadow-md shadow-customGray/55 rounded-md py-3'
        >
            <h2 className='w-full h-fit flex justify-center items-center font-semibold text-xl mb-3'>Contact us:</h2>
            <label className='w-full h-fit flex justify-center items-center' htmlFor="userName">Type your name:</label>
            <input
                type="text"
                className='w-10/12 h-fit flex justify-center items-center pl-2 rounded-md border-[1px] border-slate-600'
                name="userName"
                id="userName"
                ref={userNameRef}
                required />
            <label htmlFor="userEmail">Type your e-mail address:</label>
            <input
                type="email"
                className='w-10/12 h-fit flex justify-center items-center pl-2 rounded-md border-[1px] border-slate-600'
                name="userEmail"
                id="userEmail"
                ref={userEmailRef}
                required />
            <label className='w-full h-fit flex justify-center items-center' htmlFor="userMessage">Type your message:</label>
            <textarea
                className='w-10/12 h-fit flex justify-center items-center pl-2 resize-none rounded-md border-[1px] border-slate-600'
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