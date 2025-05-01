import { useState, useEffect, useRef} from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useDeviceType } from '@hooks/useDeviceType';
import { useModal } from '@hooks/useModal';
import { serverUrl } from '../../../configs/url';
import { mapPhotos } from '@utils/arraysUtils/mapPhotos';
import ScreenShotModal from '@components/modals/ScreenshotModal';
import { type Shots } from '@models/homePageStoreTypes'
import { type PhotosMap } from '@utils/arraysUtils/mapPhotos';

export interface AppGalleryProps {
    photos: Shots;
};

export default function AppGallery({ photos }: AppGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isMobile, isTablet, isDesktop } = useDeviceType();
    const sliderRef = useRef(null);
    const isInView = useInView(sliderRef, { once: false, margin: "0px" });
    const intervalRef = useRef<number | null>(null);
    const { modal, openModal, closeModal } = useModal<PhotosMap>({ isOpen: false, modalType: '', data: null });

    const mappedPhotos = mapPhotos(photos, isMobile, isTablet, isDesktop, serverUrl);


    useEffect(() => {
        if (isInView && mappedPhotos.length > 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % mappedPhotos.length);
            }, 3000);
        } else {
           if(intervalRef.current !== null) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, [isInView, mappedPhotos]);

    const handleMouseEnter = () => {
      if(intervalRef.current)  clearInterval(intervalRef.current);
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

    if (mappedPhotos.length === 0) {
        return <div>Brak zdjęć.</div>
    }

    return (
        <div
            ref={sliderRef}
            className="relative w-10/12 h-full md:w-11/12 md:h-full flex justify-center items-center rounded-md"
        >
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    className="relative w-full h-full flex justify-center items-start xl:items-start rounded-md overflow-hidden "
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
                    {mappedPhotos.length > 0 && (
                        <motion.img
                            key={currentIndex}
                            src={mappedPhotos[currentIndex]?.src || ""}
                            alt=""
                            srcSet={mappedPhotos[currentIndex]?.srcSet || ""}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 1100px"
                            className="h-full w-full xl:w-9/12 flex justify-center items-center object-fit xl:scale-105 xl:object-contain opacity-75 cursor-zoom-in aspect-auto"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleImageClick}
                            onDragEnd={handleImageClick}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
            {modal && modal.isOpen && modal.modalType === 'photo' && <ScreenShotModal isOpen={modal.isOpen} onRequestClose={closeModal} imageData={modal.data} />}
        </div>
    );
}
