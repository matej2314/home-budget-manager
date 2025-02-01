import { Link } from "react-router-dom"
import NotificationDot from "./NotificationDot"
import { Icon } from '@iconify/react';

export default function HeaderIconsContainer({ filteredDataMessages, socketMessages }) {

    return (
        <div id="icons-container" className="w-fit flex justify-center items-center gap-2">
            <Link title='Notifications' className="w-full h-full hover:text-lime-700">
                <Icon icon='material-symbols:notifications-outline' width={20} height={20} /></Link>
            {(filteredDataMessages.length > 0 && (
                <NotificationDot
                    color='bg-red-700'
                    data={filteredDataMessages.length}
                    head={true}
                />
            )
            )}
            {(socketMessages.length > 0 && (
                <NotificationDot
                    color='bg-green-700'
                    data={socketMessages.length}
                    head={true}
                />
            )
            )}
            <Link to='/dashboard/messages' title="Messages" className="w-fit h-fit hover:text-sky-700">
                <Icon icon='tabler:messages' width={20} height={20} />
            </Link>
            <Link to='/dashboard/myhouse' title="My house" className="w-fit h-fit hover:text-yellow-900">
                <Icon icon='ph:house-bold' width={20} height={20} />
            </Link>
        </div>
    )
}