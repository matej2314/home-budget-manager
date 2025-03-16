import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useIsMobile } from '../../../hooks/useIsMobile';
import useModal from '../../../hooks/useModal';
import { serverUrl } from '../../../url';
import { mapPhotos } from '../../../utils/arraysUtils/mapPhotos';
import ScreenShotModal from '../../modals/ScreenshotModal';

export default function AppGallery({ photos }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isMobile, isTablet, isDesktop } = useIsMobile();
    const mappedPhotos = mapPhotos(photos, isMobile, isTablet, isDesktop, serverUrl) || [];
    const sliderRef = useRef(null);
    const isInView = useInView(sliderRef, { once: false, margin: "0px" });
    const intervalRef = useRef(null);
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null, data: null });

    useEffect(() => {
        if (isInView && !modal.isOpen) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % mappedPhotos.length);
            }, 3000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isInView, mappedPhotos, modal]);

    const handleMouseEnter = () => {
        clearInterval(intervalRef.current);
    };

    const handleMouseLeave = () => {
        if (isInView && !modal.isOpen) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % mappedPhotos.length)
            }, 3000);
        };
    };

    const handleImageClick = () => {
        openModal('photo', mappedPhotos[currentIndex]);
    };

    return (
        <div
            ref={sliderRef}
            className="relative w-11/12 h-full md:w-11/12 md:h-full xl:w-full flex justify-center items-center rounded-md"
        >
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    className="relative w-fit h-full flex justify-center items-center rounded-md  overflow-hidden "
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.6 } }}
                    transition={{
                        duration: 1.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 30,
                        ease: "easeInOut",
                        mode: "wait",
                    }}
                >
                    <motion.img
                        key={currentIndex}
                        src={mappedPhotos[currentIndex].src}
                        alt=""
                        srcSet={mappedPhotos[currentIndex].srcSet}
                        sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1100px"
                        className="w-full h-full flex justify-center items-center object-contain opacity-75"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleImageClick}
                        onDragEnd={handleImageClick}
                    />
                </motion.div>
            </AnimatePresence>
            {modal && modal.isOpen && modal.type === 'photo' && <ScreenShotModal isOpen={modal.isOpen} onRequestClose={closeModal} imageData={modal.data} />}
        </div>
    );
}
