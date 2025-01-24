import { useContext } from "react";
import { DataContext } from '../../../store/dataContext';

export default function HouseData() {
    const { data, isLoading, error } = useContext(DataContext)

    const houseData = data.dashboardData.houseData;

    return (
        <div className="w-1/3 h-fit flex flex-col items-center gap-3">
            {!isLoading && !error && data && houseData.map((house, index) => (
                <ul key={index}>
                    <li>{house.name}</li>
                    <li>{house.host}</li>
                    <li>{house.balance}</li>
                    <li>{balance.balanceDate}</li>
                </ul>
            ))}
        </div>
    )
}