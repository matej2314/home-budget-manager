import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fetchData from '../../../utils/fetchData';


export default function AppGallery() {
    const [currentScreen, setCurrentScreen] = useState(0);

    return (
        <div className="w-full h-fit flex justify-center items-center pt-10 gap-5">
            <div className='w-full h-[250px] flex justify-center items-center bg-slate-600'>

            </div>

        </div>

    )
}