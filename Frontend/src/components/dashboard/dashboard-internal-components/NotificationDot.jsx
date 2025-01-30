export default function NotificationDot({ color, data }) {
    return (
        <span
            className={`${color} w-4 h-4 rounded-full absolute ${color === 'bg-green-700' ? 'top-[1.07rem] left-[23.9rem]'
                : 'top-[1.07rem] left-[25rem]'} text-white text-center text-xs flex items-center justify-center`}>
            {data}
        </span>
    )
}