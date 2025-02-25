import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export const useIsMobile = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [isMobileState, setIsMobileState] = useState(isMobile);

    useEffect(() => {
        setIsMobileState(isMobile);
        console.log('Mobile user.');
    }, [isMobile]);

    return isMobileState;
};