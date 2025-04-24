import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDeviceType } from '@hooks/useDeviceType';
import { dashboardVariants, homeVariants } from '../../../utils/animationVariants';

interface OpenMenuButtonProps  {
    isOpened: boolean;
    actionCallback: () => void;
    home?: boolean;
};

export default function OpenMenuButton({ isOpened, actionCallback, home }: OpenMenuButtonProps) {
    const { isMobile, isTablet } = useDeviceType();

    const openValue = useMemo(() => {
        if (isTablet) return 'calc(95.5vw)';
        if (isMobile) return 'calc(93vw)';
        return 0;
    }, [isTablet, isMobile]);

    const boardVariants = dashboardVariants(isOpened);
    const pageVariants = homeVariants(isOpened);

    return (
        <motion.button
            id='openMenuBtn'
            custom={openValue}
            variants={home ? pageVariants : boardVariants}
            initial='initial'
            animate='animate'
            onDragStart={actionCallback}
            onClick={actionCallback}
            className={`absolute 
            ${!home ? 'top-[4rem] left-0' : 'top-[0.5rem]'} 
            ${isOpened && home ? 'bg-transparent border-0 p-0 mt-2 ml-[0.6rem] indirect:ml-[1rem] indirect:mt-2.5 indirectxl:mt-[0.45rem] md:mt-2 md:ml-2' : 'p-2 border-2 border-slate-300'} 
            text-slate-100 rounded-md z-10 
            ${isOpened && home ? '' : 'bg-slate-500'}`}
        >
            {!isOpened || !home ? (
                <div className='flex flex-col gap-1'>
                    <span className='open-menu-btn-span'></span>
                    <span className='open-menu-btn-span'></span>
                    <span className='open-menu-btn-span'></span>
                </div>
            ) : (
                <div className='flex flex-col gap-1.5 md:gap-1.5'>
                    <span className='md:w-3 w-3 h-[0.12rem] md:h-0.5 bg-slate-100 -rotate-45'></span>
                    <span className='md:w-3 w-3 h-[0.12rem] md:h-0.5 bg-slate-100 rotate-45'></span>
                </div>
            )}
        </motion.button>

    )

}