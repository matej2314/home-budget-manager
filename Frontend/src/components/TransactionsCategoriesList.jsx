import { useContext } from "react";
import { DataContext } from "../store/dataContext";


export default function TransactionsCategoriesList() {
    const { data, isLoading, error } = useContext(DataContext);

    const actionsCats = data.dashboardData.actionsCatData;

    return (
        <div>
            {!isLoading && !error && actionsCats ? (
                actionsCats.map((cat) => (
                    <ul key={cat.id}>
                        <li data-id={cat.id}>{cat.name}-{cat.type}</li>
                    </ul>
                ))
            ) : (
                <p>Brak kategorii transakcji</p>
            )
            }
        </div >
    )
}