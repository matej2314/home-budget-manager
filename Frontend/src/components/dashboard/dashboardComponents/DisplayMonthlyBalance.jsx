import { useContext } from "react";
import { DataContext } from '../../../store/dataContext';
export default function DisplayMonthlyBalance() {
    const { data, isLoading, error } = useContext(DataContext);
}