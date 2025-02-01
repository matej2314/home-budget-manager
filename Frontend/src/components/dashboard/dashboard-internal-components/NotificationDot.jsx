export default function NotificationDot({ color, data, head }) {

    const headerClasses = `${color} w-4 h-4 rounded-full absolute ${color === 'bg-green-700' ? 'top-[1.07rem] left-[23.8rem]'
        : 'top-[1.07rem] left-[24.9rem]'} text-white text-center text-xs flex items-center justify-center pb-[.1rem]`;

    const menuClasses = `${color} w-5 h-5 rounded-full flex items-center justify-center absolute top-[15.5rem] left-[9.4rem] pb-[.1rem] text-white text-xs`;

    return (
        <span
            className={head ? headerClasses : menuClasses}>
            {data}
        </span>
    )
}