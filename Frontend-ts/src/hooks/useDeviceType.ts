import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

export const useDeviceType = () => {
    const isMobile: boolean = useMediaQuery({ minWidth: 360, maxWidth: 767 });
    const isTablet: boolean = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const isDesktop: boolean = useMediaQuery({ minWidth: 1025 });

    function getDeviceType() {
        if (isMobile) return 'mobile';
        if (isTablet) return 'tablet';
        if (isDesktop) return 'desktop';
        return null;
    }

    const [deviceType, setDeviceType] = useState(getDeviceType());

    useEffect(() => {
        setDeviceType(getDeviceType());
    }, [isDesktop, isMobile, isTablet]);

    return { deviceType, isDesktop, isMobile, isTablet };

}