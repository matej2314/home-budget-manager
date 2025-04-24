import ContactForm from '@components/forms/ContactForm';
import useDocumentTitle from '@hooks/useDocumentTitle';

export default function ContactPage() {
    useDocumentTitle('Contact');

    return (
        <div className='w-full h-full flex-row flex justify-center items-center pb-[4rem]'>
            <ContactForm />
        </div>
    )
}