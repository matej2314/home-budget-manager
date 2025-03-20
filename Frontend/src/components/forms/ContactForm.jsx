import { useState, useRef } from 'react';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast } from '../../configs/toastify';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import SendMessageBtn from './internal/SendMessageBtn';
import { isNoXSS, isValidEmail } from '../../utils/validation';
import LoadingModal from '../modals/LoadingModal';

export default function ContactForm() {
    const [actionState, setActionState] = useState({ type: null });
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation("forms");
    const userNameRef = useRef();
    const userEmailRef = useRef();
    const userMessageRef = useRef();

    const handleSetActionState = (action) => {
        setActionState({ type: action });
    };

    const handleResetActionState = () => {
        setActionState({ type: null });
    }

    const handleContactForm = async (e) => {
        e.preventDefault();
        showInfoToast(`So far it's not working :)`);
        handleSetActionState('sended')
    };

    return (
        <form
            onSubmit={handleContactForm}
            className='contact-form'
        >
            <h2 className='w-full h-fit flex justify-center items-center font-semibold text-xl'>{t("contactForm.heading")}</h2>
            <label className='w-full h-fit flex justify-center items-center' htmlFor="userName">{t("contactForm.nameLabel")}</label>
            <div className='relative w-fit'>
                <input
                    type="text"
                    className='contact-form-input'
                    name="userName"
                    id="userName"
                    ref={userNameRef}
                    placeholder={t("contactForm.namePlaceholder")}
                    onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    required
                />
                <Icon
                    icon='tdesign:user-filled'
                    className="icon-base top-[0.15rem] text-slate-100 text-xl text-opacity-50"
                />
            </div>
            <label htmlFor="userEmail">{t("contactForm.emailLabel")}</label>
            <div className='relative w-fit flex'>
                <input
                    type="email"
                    className='contact-form-input'
                    name="userEmail"
                    id="userEmail"
                    placeholder={t("contactForm.emailPlaceholder")}
                    onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    ref={userEmailRef}
                    required
                />
                <Icon
                    icon='ic:baseline-alternate-email'
                    className="icon-base top-[0.15rem] text-slate-100 text-xl text-opacity-55"
                />
            </div>
            <label
                className='w-full h-fit flex justify-center items-center'
                htmlFor="userMessage">{t("contactForm.messageLabel")}
            </label>
            <div className='relative w-10/12'>
                <textarea
                    className='contact-form-textarea'
                    name="userMessage"
                    id="userMessage"
                    placeholder={t("contactForm.messagePlaceholder")}
                    rows="10"
                    ref={userMessageRef}
                    onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    required
                />
                <Icon
                    icon='ic:outline-message'
                    className="icon-base top-[0.25rem] text-slate-200 text-xl text-opacity-65"
                />
            </div>
            <SendMessageBtn form='contact' state={actionState} setState={handleSetActionState} resetState={handleResetActionState} />
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </form>
    )
}