import { useState } from 'react';
import Modal from 'react-modal';
import Authorization from '../home-page-components/Authorization';

export default function AuthModal({ isOpen, onRequestClose }) {
    const [mode, setMode] = useState(null);

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-white rounded-lg p-6 w-9/12 md:w-1/3 mx-auto mt-4 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            {mode ? (
                <>
                    <button onClick={onRequestClose} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>X</button>
                    <Authorization mode={mode} />
                </>
            ) : (
                <div className='text-center'>
                    <div className='flex justify-around'>
                        <button
                            onClick={() => handleModeChange('login')}
                            className='px-4 py-3 bg-slate-500/80 text-white rounded-lg hover:bg-slate-300 hover:text-slate-600'
                        >
                            Login
                        </button>
                        <button
                            onClick={() => handleModeChange('register')}
                            className='px-4 py-2 bg-slate-500/90 text-white rounded-lg hover:bg-slate-400 hover:text-slate-800'
                        >
                            SignUp
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    )
}