import AppModal from './AppModal';
import { motion } from 'framer-motion';

export default function LoadingModal({ isOpen }) {

    return (
        <AppModal
            isOpen={isOpen}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            contentLabel="Loading"
            className="bg-transparent border-0 shadow-none outline-none p-0"
        >
            <div className="flex justify-center items-center">
                <motion.div
                    className='w-16 h-16 border-4 border-dotted border-accent rounded-full'
                    animate={{
                        rotate: 360,
                        borderColor: ['#4c6fff', '#35BD13', '#4c6fff', '#35BD13'],
                        scale: [1, 1.35, 1],
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
            </div>
        </AppModal>
    )
}
