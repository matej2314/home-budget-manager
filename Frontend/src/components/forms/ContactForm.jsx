import { useState, useRef } from 'react';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast } from '../../configs/toastify';
import { Icon } from '@iconify/react';

export default function ContactForm() {
    const [sended, setSended] = useState(false);
    const userNameRef = useRef();
    const userEmailRef = useRef();
    const userMessageRef = useRef();

    const handleContactForm = async (e) => {
        e.preventDefault();
        showInfoToast(`So fat it's not working :)`);
    };
    return (
        <form
            onSubmit={handleContactForm}
            className='w-9/12 text-sm indirect:w-9/12 indirect:text-base indirectxl:w-8/12 md:w-1/3 h-fit flex flex-col justify-start items-center bg-slate-300/15 gap-3 border-2 border-slate-300 text-slate-200 shadow-md shadow-customGray/55 rounded-md py-3'
        >
            <h2 className='w-full h-fit flex justify-center items-center font-semibold text-xl mb-3'>Contact us:</h2>
            <label className='w-full h-fit flex justify-center items-center' htmlFor="userName">Type your name:</label>
            <div className='relative w-10/12'>
                <input
                    type="text"
                    className='w-full h-fit flex justify-center items-center pl-2 rounded-md border-2 border-slate-600 text-slate-800'
                    name="userName"
                    id="userName"
                    ref={userNameRef}
                    placeholder='name'
                    onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    required
                />
                <Icon
                    icon='tdesign:user-filled'
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer text-opacity-45 pointer-events-none"
                />
            </div>

            <label htmlFor="userEmail">Type your e-mail address:</label>
            <div className='relative w-10/12'>
                <input
                    type="email"
                    className='w-full h-fit flex justify-center items-center pl-2 rounded-md border-2 border-slate-600 text-slate-800'
                    name="userEmail"
                    id="userEmail"
                    placeholder='email'
                    onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    ref={userEmailRef}
                    required
                />
                <Icon
                    icon='ic:baseline-alternate-email'
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer text-opacity-55 pointer-events-none"
                />
            </div>

            <label className='w-full h-fit flex justify-center items-center' htmlFor="userMessage">Type your message:</label>
            <div className='relative w-10/12'>
                <textarea
                    className='w-full h-fit flex justify-center items-center pl-2 resize-none rounded-md border-2 border-slate-600 text-slate-800'
                    name="userMessage"
                    id="userMessage"
                    placeholder='message'
                    rows="10"
                    ref={userMessageRef}
                    onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    required
                />
                <Icon
                    icon='ic:outline-message'
                    className="absolute right-2 top-4 transform -translate-y-1/2 text-gray-500 text-xl pointer-events-none text-opacity-55"
                />
            </div>

            <button
                type="submit"
                className="bg-gray-300 text-black p-2 rounded-md border-2 border-slate-600 hover:bg-gray-500 hover:text-slate-300 shadow-md shadow-slate-700 active:shadow-sm"

            >Send message
            </button>
        </form>
    )
}