import { useContext } from 'react'
import { DataContext } from '../../../store/dataContext';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion'
import { iconsMap } from '../../../utils/notificationsIconsMap';

export default function NotificationsContainer({ notifications, clickAction }) {
    const { data, isLoading, error } = useContext(DataContext);
    const { t: tInternal } = useTranslation("dashboardInternal");
    const { t: tCommon } = useTranslation("common")

    const houseName = !isLoading && !error && data.houseData[0].houseName || '';

    return (
        <motion.div
            className='absolute top-[3.5rem] indirect:top-[3.3rem] indirectxl:top-[3.5rem] md:top-[3.3rem] xl:top-[2.8rem] left-[1.5rem] indirect:left-[5.5rem] sm:left-[5.3rem] md:left-[14.5rem] lg:left-[16.6rem] bg-white shadow-lg border-2 border-slate-500/80 rounded-md xl:mt-2 p-2 xl:w-[23.5rem] z-10'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {notifications ? (
                Object.entries(notifications).some(([_, items]) => items.length > 0) ? (
                    <ul className='w-full flex flex-col gap-2'>
                        {Object.entries(notifications).map(([category, items]) => items.map((notification, index) => (
                            <li
                                key={`${category}-${index}`}
                                className={`w-full h-fit flex items-center gap-2 ${index === items.length - 1 ? 'border-0' : 'border-b-[1px] border-slate-300 pb-2'} `}
                            >
                                <Icon icon={iconsMap[category]} width={25} height={25} />
                                <p className='w-full h-fit flex items-center justify-center text-nowrap'>
                                    <span className='font-bold mr-2 text-sm indirectxl:text-base'>{houseName} :</span>
                                    <span className='text-sm indirectxl:text-base'>{tCommon(notification.message)}</span>
                                    <button
                                        type="button"
                                        className='ml-2'
                                        onClick={() => clickAction(category, notification.id)}
                                    >
                                        <Icon
                                            className='indirectxl:w-5 indirectxl:h-5'
                                            icon='teenyicons:tick-circle-outline'
                                            color='#2fd203'
                                        />
                                    </button>
                                </p>
                            </li>
                        ))
                        )}
                    </ul>
                ) : (
                    <p>{tInternal("notificationsContainer.noNoticesError")}</p>
                )
            ) : (
                <p>{tInternal("notificationsContainer.noNoticesError")}</p>
            )
            }
        </motion.div>
    )

}