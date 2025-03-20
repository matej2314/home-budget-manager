import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const BackToUsMessage = () => {
    const { t } = useTranslation("common");

    useEffect(() => {
        const originalTitle = document.title;
        let textInterval;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                textInterval = setInterval(() => {
                    document.title = document.title === t("backToUsMessage")
                        ? originalTitle
                        : t("backToUsMessage");
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
