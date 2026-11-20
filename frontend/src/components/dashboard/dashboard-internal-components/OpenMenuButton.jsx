import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { dashboardVariants, homeVariants } from '../../../utils/animationVariants';

export default function OpenMenuButton({ isOpened, actionCallback, home }) {
    const { isMobile, isTablet } = useIsMobile();

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
            type="button"
            aria-label={isOpened ? 'Close menu' : 'Open menu'}
            custom={openValue}
            variants={home ? pageVariants : boardVariants}
            initial='initial'
            animate='animate'
            onDragStart={actionCallback}
            onClick={actionCallback}
            className={`fixed z-40 flex items-center justify-center rounded-lg transition-colors
            ${!home ? 'top-3 left-3' : 'top-3 left-3'}
            ${isOpened && home
                    ? 'bg-transparent border-0 p-2 text-slate-100'
                    : home
                        ? 'p-2 border border-white/25 bg-white/10 text-slate-100 backdrop-blur-sm'
                        : 'p-2 border border-slate-200 bg-surface text-ink shadow-sm'
                }`}
        >
            {!isOpened || !home ? (
                <div className='flex flex-col gap-1'>
                    <span className='open-menu-btn-span'></span>
                    <span className='open-menu-btn-span'></span>
                    <span className='open-menu-btn-span'></span>
                </div>
            ) : (
                <div className='relative w-4 h-4'>
                    <span className='absolute inset-x-0 top-1/2 h-[0.12rem] bg-current -rotate-45'></span>
                    <span className='absolute inset-x-0 top-1/2 h-[0.12rem] bg-current rotate-45'></span>
                </div>
            )}
        </motion.button>

    )

}
