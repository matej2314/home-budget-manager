export const dashboardVariants = (isOpened) => ({
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
});

export const homeVariants = (isOpened) => ({
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
});

export const messageFormVariants = (state) => ({
    initial: { x: -50, y: -25, opacity: 0 },
    animate: state.type === 'sended' ? { y: -170, x: 250, opacity: 1 }
        : state.type === 'hover'
            ? { x: 185, rotate: 22, opacity: 1 }
            : { opacity: 1 }
});

export const contactFormVariants = (state) => ({
    initial: { x: -150, y: 0 },
    animate: state.type === 'sended'
        ? { x: 150, y: -50, opacity: 0 }
        : {
            x: state.type === 'hover' ? 75 : -150,
            rotate: state.type === 'hover' ? 22 : 0
        }
});

export const wrapperVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
            type: 'tween',
            ease: 'easeInOut',
        },
    },
    exit: { opacity: 0 }
};

export const elementsVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 2, ease: 'easeInOut' } },
    exit: { opacity: 0, transition: { duration: 1, delay: 1, ease: 'easeInOut' } },
};

export const lastElementVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 1, delay: 1.3, ease: 'easeInOut' },
    },
};

