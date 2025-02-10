import Modal from 'react-modal';
import { motion } from 'framer-motion';

export default function LoadingModal({ isOpen }) {

    return (
        <Modal
            isOpen={isOpen}
            className="w-[400px] bg-transparent translate-x-[40vw] translate-y-[40vh] flex justify-center items-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <motion.div
                className='w-16 h-16 border-4 border-dotted border-gray-400 rounded-full'
                whileInView={{
                    rotate: 360, borderColor: ['#EC2626', '#35BD13', '#EC2626', '#35BD13'],
                    scale: [1, 1.5, 1],

                }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                viewport={{ once: true }}
            />
        </Modal>
    )
}