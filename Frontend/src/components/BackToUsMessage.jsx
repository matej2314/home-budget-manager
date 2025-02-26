import { useEffect } from 'react';

const BackToUsMessage = () => {
    useEffect(() => {
        const originalTitle = document.title;
        let textInterval;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                textInterval = setInterval(() => {
                    document.title = document.title === 'Wracaj do nas!'
                        ? originalTitle
                        : 'Wracaj do nas!';
                }, 1500);
            } else {
                clearInterval(textInterval);
                document.title = originalTitle;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(textInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return null;
};

export default BackToUsMessage;
