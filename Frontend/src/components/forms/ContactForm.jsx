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
            className='contact-form'
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
                    className="icon-base text-gray-500 text-xl text-opacity-45"
                />
            </div>

            <label htmlFor="userEmail">Type your e-mail address:</label>
            <div className='relative w-10/12'>
                <input
                    type="email"
                    className='contact-form-input'
                    name="userEmail"
                    id="userEmail"
                    placeholder='email'
                    onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    ref={userEmailRef}
                    required
                />
                <Icon
                    icon='ic:baseline-alternate-email'
                    className="icon-base text-gray-500 text-xl text-opacity-55"
                />
            </div>

            <label className='w-full h-fit flex justify-center items-center' htmlFor="userMessage">Type your message:</label>
            <div className='relative w-10/12'>
                <textarea
                    className='contact-form-textarea'
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
                    className="icon-base text-gray-500 text-xl text-opacity-55"
                />
            </div>

            <button
                type="submit"
                className="contact-form-submit-btn"

            >Send message
            </button>
        </form>
    )
}