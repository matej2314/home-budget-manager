import { useContext } from "react"
import { Icon } from '@iconify/react';
import { DataContext } from '../../../store/dataContext';
import { AuthContext } from "../../../store/authContext";

export default function HouseMatesList() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { data, isLoading, error } = useContext(DataContext);

    const houseMates = !isLoading && !error ? data.dashboardData.houseMates : [];

    return (
        <div id="matesList" className="w-1/3 h-fit flex flex-col justify-start items-center rounded-md border-2 border-slate-500/20 my-4 ml-5 gap-3 py-2 px-5">
            <h2 className="w-full h-fit flex justify-center text-xl text-slate-700">Your housemates:</h2>
            <ul className="w-full h-fit flex flex-col justify-start items-center text-lg gap-3">
                {!isLoading && houseMates.length > 0 ? (
                    houseMates.map((mate, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 text-lg"
                        >
                            <span>
                                {mate.userName} -
                            </span>
                            <span>
                                {mate.role} -
                            </span>
                            <span className="w-fit h-fit flex gap-3">
                                <button
                                    type="button"
                                    className="w-fit h-fit"
                                >
                                    <Icon icon='mdi-light:message' width={20} height={20} />
                                </button>
                                <button
                                    type="button"
                                    className="w-fit h-fit"
                                >
                                    <Icon icon='hugeicons:transaction' width={20} height={20} />
                                </button>
                                <button
                                    type="button"
                                    className="w-fit h-fit"
                                    disabled={user.role !== 'superadmin'}
                                >
                                    <Icon icon='mi:delete' width={20} height={20} />
                                </button>
                            </span>
                        </li>
                    ))
                ) : (
                    <p>Brak domowników</p>
                )}
            </ul>
        </div>
    );
}

