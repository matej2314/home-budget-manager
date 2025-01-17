import { useContext } from "react";
import { DataContext } from "../../../store/dataContext";

export default function HouseMates() {
    const { data, isLoading, error } = useContext(DataContext);

    const matesData = data.dashboardData.houseMates;

    return (
        <div>
            {!isLoading && !error && data ? (
                matesData.map((mate, index) => (
                    <ul key={index}>
                        <li><span>{mate.userName}-{mate.role}</span></li>
                    </ul>
                ))
            ) : (
                <p>Brak informacji o domownikach.</p>
            )}
        </div>
    )
}