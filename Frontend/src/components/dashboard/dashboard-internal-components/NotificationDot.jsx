export default function NotificationDot({ color, data, head }) {
    const position = () => {
        if (color === 'bg-green-700') {
            return 'top-[1rem] left-[24rem]';
        } else if (color === 'bg-red-700') {
            return 'top-[1rem] left-[25.1rem]';
        } else {
            return '';
        }
    };

    const headerClasses = `${color} w-4 h-4 rounded-full absolute ${position()} text-white text-center text-xs flex items-center justify-center pb-[.1rem]`;

    const menuClasses = `${color} w-5 h-5 rounded-full flex items-center justify-center absolute top-[20rem] left-[9.4rem] pb-[.1rem] text-white text-xs`;

    return (
        <span
            className={head ? headerClasses : menuClasses}>
            {data}
        </span>
    )
}