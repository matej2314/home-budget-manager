import { useContext } from "react";
import { AuthContext } from "../../store/authContext";
import { DataContext } from "../../store/dataContext";
import { Icon } from '@iconify/react';

export default function MatesList({ mode }) {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { data, isLoading, error } = useContext(DataContext);

    // Uproszczenie logiki w przypadku isLoading i error
    const houseMates = !isLoading && !error ? data.dashboardData.houseMates : [];

    return (
        <ul className="w-full h-fit flex flex-col justify-start items-center text-lg gap-3">
            {/* Sprawdzamy, czy dane są załadowane oraz czy lista houseMates nie jest pusta */}
            {isLoading ? (
                <p>Ładowanie...</p>
            ) : error ? (
                <p>Wystąpił błąd podczas ładowania danych.</p>
            ) : houseMates.length > 0 ? (
                houseMates.map((mate, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-2 text-lg"
                    >
                        <span>{mate.userName} -</span>
                        <span>{mate.role} -</span>
                        <span className="w-fit h-fit flex gap-3">
                            <button
                                type="button"
                                className="w-fit h-fit"
                            >
                                <Icon icon='mdi-light:message' width={20} height={20} />
                            </button>
                            {mode == 'subpage' && (
                                <>
                                    <button
                                        type="button"
                                        className="w-fit h-fit"
                                    >
                                        <Icon icon='hugeicons:transaction' width={20} height={20} />
                                    </button>
                                    <button
                                        type="button"
                                        className="w-fit h-fit"
                                        hidden={user.role !== 'superadmin'}
                                    >
                                        <Icon icon='mi:delete' width={20} height={20} />
                                    </button>
                                </>
                            )}
                        </span>
                    </li>
                ))
            ) : (
                <p>Brak domowników</p>
            )}
        </ul>
    );
}
