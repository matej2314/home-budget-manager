import { motion } from 'framer-motion';

export default function OpenMenuButton({ isOpened, actionCallback }) {
    return (
        <motion.button
            id='openMenuBtn'
            initial={{ x: 0 }}
            animate={{ x: isOpened ? '16rem' : 0 }}
            transition={{ duration: 0.3, type: 'tween' }}
            onDragStart={actionCallback}
            onClick={actionCallback}
            className={`absolute top-0 left-0 p-2 border-2 border-slate-300 text-slate-100 rounded-md bg-customGray z-20`}
        >
            <div className='flex flex-col gap-1'>
                <span className='w-5 h-0.5 bg-slate-100'></span>
                <span className='w-5 h-0.5 bg-slate-100'></span>
                <span className='w-5 h-0.5 bg-slate-100'></span>
            </div>
        </motion.button>
    )

}