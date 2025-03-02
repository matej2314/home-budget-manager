import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export const useIsMobile = () => {
    const isMobile = useMediaQuery({ minWidth: 360, maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const isDesktop = useMediaQuery({ minWidth: 1025 });

    const [deviceType, setDeviceType] = useState(getDeviceType());

    function getDeviceType() {
        if (isMobile) return 'mobile';
        if (isTablet) return 'tablet';
        if (isDesktop) return 'desktop';
        return null;
    }

    useEffect(() => {
        setDeviceType(getDeviceType()
        )
    }, [isMobile, isDesktop, isTablet]);

    return { deviceType, isDesktop, isMobile, isTablet };

};