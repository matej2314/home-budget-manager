import Modal from 'react-modal';
import { motion } from 'framer-motion';

type LoadingModalInput = {
    isOpen: boolean;
};

export default function LoadingModal({ isOpen }: LoadingModalInput) {

    return (
        <Modal
            isOpen={isOpen}
            className="w-full h-full flex justify-center items-center border-0"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div>
                <motion.div
                    className='w-16 h-16 border-4 border-dotted border-gray-400 rounded-full'
                    whileInView={{
                        rotate: 360, borderColor: ['#EC2626', '#35BD13', '#EC2626', '#35BD13'],
                        scale: [1, 1.5, 1],

                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    viewport={{ once: true }}
                />
            </div>

        </Modal>
    )
}