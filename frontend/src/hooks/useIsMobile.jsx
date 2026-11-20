import { useMediaQuery } from "react-responsive";

export const useIsMobile = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const isDesktop = useMediaQuery({ minWidth: 1025 });

    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : isDesktop ? 'desktop' : null;

    return { deviceType, isDesktop, isMobile, isTablet };
};
