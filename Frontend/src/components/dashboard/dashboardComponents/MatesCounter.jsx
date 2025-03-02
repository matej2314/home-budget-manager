import { useContext } from "react";
import { DataContext } from "../../../store/dataContext";
import { getData } from '../../../utils/getData';
import { Icon } from '@iconify/react';

export default function MatesCounter() {
    const { data, isLoading, error } = useContext(DataContext);

    const matesData = getData(isLoading, error, true, data.houseMates);

    return (
        <div id='housemates'
            className="relative w-full lg:w-1/4 h-[8.5rem] bg-gradient-to-br from-red-400 via-rose-600 to-red-700/85 text-xl text-white flex flex-col justify-start items-center rounded-md pt-6"
            style={{ boxShadow: 'inset 0 0 6px 6px rgba(0, 0, 0, 0.15)' }}
        >
            <div className="absolute bottom-0 right-0 flex justify-center items-center">
                <Icon icon='lucide:users-round' width={105} style={{ opacity: 0.2, position: 'relative', top: '0.5rem', left: '0.4rem' }} />
            </div>
            <div className="h-1/2 w-1/2 flex flex-col justify-center items-center gap-4">
                <h2 className="text-2xl">Housemates:</h2>
                {!isLoading && !error && <span className="text-2xl">{matesData.length}</span>}
            </div>
        </div>
    );
}
