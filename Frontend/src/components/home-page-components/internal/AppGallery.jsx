import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function AppGallery({ photos }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const formattedPhotos = photos.map(photo => photo.split('-')[0]);

    const nextScreen = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % formattedPhotos.length)
    };

    const prevScreen = () => {
        setCurrentIndex(prevIndex => prevIndex === 0 ? formattedPhotos.length - 1 : prevIndex - 1);
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    const handleDragEnd = (event, info) => {
        const dragTreshold = 50;
        const transitionDuration = 0.5;

        if (info.offset.x > dragTreshold) {
            nextScreen();
        } else if (info.offset.x < -dragTreshold) {
            prevScreen();
        };
    };

    const currentScreen = formattedPhotos[currentIndex];

    return (
        <div className='w-full h-full flex justify-center items-center bg-slate-600'>
            <AnimatePresence mode='popLayout'>
                <motion.div>
                    <motion.img src="" alt="" srcset="" sizes='' />
                </motion.div>
            </AnimatePresence>
            <div>
                <button type="button"></button>
                <button type="button"></button>
            </div>
            <div>
                <span>

                </span>
            </div>
        </div>
    )
}