import { Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from 'react-modal';
import Authorization from './Authorization';
import LanguageSelector from '../dashboard/dashboard-internal-components/LanguageSelector';

Modal.setAppElement('#root');

export default function MainPageMenu() {
    const [isModalOpen, setisModalOpen] = useState(false);
    const [mode, setMode] = useState(null);

    const openModal = () => setisModalOpen(true);
    const closeModal = () => {
        setisModalOpen(false);
        setMode(null);
    };

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    }
    return (
        <div id="mainMenu" className="w-[98vw] h-fit flex border-2 border-y-slate-300 rounded-md shadow-sm shadow-slate-400">
            <ul className="w-full h-fit flex justify-between items-center px-3 py-1 text-slate-800 text-md">
                <li>Main Page</li>
                <li>About us</li>
                <li onClick={openModal} className='cursor-pointer'>SignUp/Login</li>
                <li>Contact</li>
                <LanguageSelector />
            </ul>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className='bg-white rounded-lg p-6 w-1/3 mx-auto mt-20 shadow-lg border-4 border-slate-400'
                overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
            >
                {mode ? (
                    <>
                        <button onClick={closeModal} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>X</button>
                        <Authorization mode={mode} />
                    </>
                ) : (
                    <div className='text-center'>
                        <h2 className='text-xl font-bold mb-4'>Choose option</h2>
                        <div className='flex justify-around'>
                            <button
                                onClick={() => handleModeChange('login')}
                                className='px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleModeChange('register')}
                                className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
                            >
                                SignUp
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}