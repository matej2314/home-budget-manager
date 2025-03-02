import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function OpenMenuButton({ isOpened, actionCallback, home }) {
    const { isMobile, isTablet } = useIsMobile();

    const openValue = useMemo(() => {
        if (isTablet) return 'calc(95.5vw)';
        if (isMobile) return 'calc(93vw)';
        return 0;
    }, [isTablet, isMobile]);

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
            transition: {
                duration: 0.3,
                type: 'tween',
            }
        },
        animate: custom => ({
            x: isOpened ? custom : 0,
            transition: { duration: 0.1, type: 'tween' }
        })
    };


    return (
        <motion.button
            id='openMenuBtn'
            custom={openValue}
            variants={home ? homeVariants : dashboardVariants}
            initial='initial'
            animate='animate'
            onDragStart={actionCallback}
            onClick={actionCallback}
            className={`absolute ${!home ? 'top-[4rem] left-0' : 'top-0.5'} ${home ? 'p-1' : 'p-2'} border-2 border-slate-300 text-slate-100 rounded-md z-10 ${home ? 'bg-slate-500' : 'bg-customGray z-20'}`}
        >
            <div className='flex flex-col gap-1'>
                <span className='md:w-5 w-3 h-[0.12rem] md:h-0.5 bg-slate-100'></span>
                <span className='md:w-5 w-3 h-[0.12rem] md:h-0.5 bg-slate-100'></span>
                <span className='md:w-5 w-3 h-[0.12rem] md:h-0.5 bg-slate-100'></span>
            </div>
        </motion.button>
    )

}