import HouseData from "./dashboardComponents/HouseData";
import HouseMates from "./dashboardComponents/HouseMates";
import HouseTransactions from './dashboardComponents/HouseTransactions';


export default function DashBoard() {
    return (
        <main className="w-full h-full flex flex-col justify-around items-start">
            <div className="w-full h-full flex flex-row justify-between items-center px-5 py-5">
                <HouseData />
                <HouseMates />
                <HouseTransactions />
            </div>
        </main>
    )
};