import HomePageMenu from '../components/home-page-components/HomePageMenu';
import ContactForm from '../components/forms/ContactForm';

export default function ContactPage() {


    return (
        <main className="w-full h-screen flex flex-col justify-center items-center text-black">
            <HomePageMenu />
            <div className='w-full h-full flex justify-center items-center'>
                <ContactForm />
            </div>
        </main>
    )
}