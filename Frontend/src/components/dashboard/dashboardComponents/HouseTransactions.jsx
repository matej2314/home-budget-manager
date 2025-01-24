import { useContext } from "react";
import { DataContext } from "../../../store/dataContext";

export default function HouseTransactions() {
    const { data, isLoading, error } = useContext(DataContext);

    const transactions = data.dashboardData.actionsData || '';
    const houseName = data.dashboardData.houseData.name || '';

    return (
        <div>
            {/* {data && !isLoading && !error ? (
                transactions.map((transaction) => (
                    <ul key={transaction.transaction_id}>
                        <h2>Transactions for {houseName}</h2>
                        <li data-id={transaction.transaction_id}>
                            <span>{transaction.value}</span>
                            <span>{transaction.category_name}</span>
                            <span>{transaction.addedAt.split('T')[0]}</span>
                        </li>
                    </ul>
                ))
            ) : (
                <p>Brak danych transakcji</p>
            )} */}
            <p>brak danych</p>
        </div>
    )



}