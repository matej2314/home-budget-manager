import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import useModal from '../../hooks/useModal';
import AuthModal from '../modals/AuthModal';

export default function Home() {
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });

    return (
        <div className="w-full h-full flex flex-col text-slate-200 justify-center items-center gap-3 pb-[9rem]">
            <h2 className="text-center text-2xl indirect:text-3xl sm:text-4xl lg:text-5xl font-urbanist font-normal">
                Web household budget manager
            </h2>
            <h3 className="text-base indirect:text-lg sm:text-xl lg:text-2xl text-center font-urbanist font-medium">
                Your personal tool to control house finances
            </h3>
            <div className="w-full h-fit flex justify-center items-start gap-3">
                <button
                    className="w-fit h-fit border-[3px] border-slate-300 text-sm px-2 py-3 rounded-xl shadow-md shadow-slate-400 active:shadow-sm"
                    type="button"
                >
                    <NavLink
                        to='aboutus'
                    >
                        About project
                    </NavLink>
                </button>
                <button
                    className="w-fit h-fit text-sm border-[3px] border-slate-300 p-2 rounded-xl shadow-md shadow-slate-400 active:shadow-sm"
                    type="button"
                    onClick={() => openModal('auth')}
                >
                    <NavLink
                        className='w-fit h-fit flex items-center gap-1'
                    >
                        Discover
                        <span className="w-fit h-fit text-lg">
                            &rarr;
                        </span>
                    </NavLink>
                </button>
            </div>
            {modal && modal.isOpen && modal.type === 'auth' && <AuthModal isOpen={modal.isOpen} onRequestClose={closeModal} />}
        </div>
    )
}