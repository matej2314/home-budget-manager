import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeSelector() {
    const [selectedTheme, setSelectedTheme] = useState('light');


    const toggleTheme = () => {
        setSelectedTheme(prevTheme => !prevTheme);
    }
}