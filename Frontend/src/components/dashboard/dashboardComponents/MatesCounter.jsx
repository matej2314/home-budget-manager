import { useContext } from "react";
import { DataContext } from "../../../store/dataContext";
import { getData } from '../../../utils/getData';

export default function MatesCounter() {
    const { data, isLoading, error } = useContext(DataContext);

    const matesData = getData(isLoading, error, true, data.houseMates);

    return (
        <div id='housemates' className="w-1/4 h-[8.5rem] bg-red-600/75 text-xl text-white flex flex-col justify-start items-center rounded-md pt-6">
            <div className="h-1/2 w-1/2 flex flex-col justify-center items-center gap-4">
                <h2 className="text-2xl">Housemates:</h2>
                {!isLoading && !error && <span className="text-2xl">{matesData.length}</span>}
            </div>
        </div>
    )
}