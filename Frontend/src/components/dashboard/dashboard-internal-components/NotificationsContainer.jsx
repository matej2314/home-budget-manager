import { useContext } from 'react'
import { DataContext } from '../../../store/dataContext';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion'

export default function NotificationsContainer({ notifications, clickAction }) {
    const { data, isLoading, error } = useContext(DataContext);

    const houseName = !isLoading && !error && data.houseData[0].houseName || '';

    const iconsMap = {
        transactions: 'tdesign:undertake-transaction',
        usersActions: 'mdi:users',
        monthlyBalance: 'healthicons:finance-dept-outline',

    };

    return (
        <motion.div
            className='absolute top-[2.8rem] left-[18rem] bg-white shadow-lg border rounded-md mt-2 p-2 w-[20rem] z-10'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {notifications ? (
                Object.entries(notifications).some(([_, items]) => items.length > 0) ? (
                    <ul>
                        {Object.entries(notifications).map(([category, items]) => items.map((notification, index) => (
                            <li key={`${category}-${index}`}
                                onClick={() => clickAction(category, notification.id)}
                                className='w-full h-fit flex items-center gap-2'
                            >
                                <Icon icon={iconsMap[category]} width={25} height={25} />
                                <p className='w-full h-fit flex items-center justify-center text-nowrap'>
                                    <span className='font-bold mr-2'>{houseName} :</span><span>{notification.message}</span></p>
                            </li>
                        ))
                        )}
                    </ul>
                ) : (
                    <p>No new notifications.</p>
                )
            ) : (
                <p>No new notifications.</p>
            )
            }
        </motion.div>
    )

}