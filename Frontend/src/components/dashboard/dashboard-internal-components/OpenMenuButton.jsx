import { delay, motion } from 'framer-motion';

export default function OpenMenuButton({ isOpened, actionCallback, home }) {


    const dashboardVariants = {
        initial: {
            x: 0,
            transition: {
                duration: 0.3,
                type: 'tween'
            }
        },
        animate: {
            x: isOpened ? '10rem' : 0,
            transition: {
                duration: 0.3,
                type: 'tween',
            }
        }
    };

    const homeVariants = {
        initial: {
            x: 0,
            y: 0,
            transition: {
                duration: 0.3,
                type: 'tween',
            }
        },
        animate: {
            y: isOpened ? '-2rem' : 0,
            x: isOpened ? 'calc(91vw - 2.5rem)' : 0,
            transition: {
                x: {
                    duration: 0.3,
                    type: 'tween',
                    delay: 0.3
                },
                y: { duration: 0.3, type: 'tween', }
            }
        }
    };


    return (
        <motion.button
            id='openMenuBtn'
            variants={home ? homeVariants : dashboardVariants}
            initial='initial'
            animate='animate'
            onDragStart={actionCallback}
            onClick={actionCallback}
            className={`absolute ${!home ? 'top-[4rem] left-0' : 'top-0'} p-2 border-2 border-slate-300 text-slate-100 rounded-md ${home ? 'bg-slate-500' : 'bg-customGray z-20'}`}
        >
            <div className='flex flex-col gap-1'>
                <span className='w-5 h-0.5 bg-slate-100'></span>
                <span className='w-5 h-0.5 bg-slate-100'></span>
                <span className='w-5 h-0.5 bg-slate-100'></span>
            </div>
        </motion.button>
    )

}