import { useContext, useState } from "react";
import { AuthContext } from "../../../store/authContext";
import { DataContext } from "../../../store/dataContext";
import { Icon } from '@iconify/react';
import SendMessageModal from '../../modals/SendMessageModal';

export default function MatesList({ mode }) {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { data, isLoading, error } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipient, setRecipient] = useState(null);

    const houseMates = !isLoading && !error ? data.dashboardData.houseMates : [];


    const handleOpenModal = (recipient) => {
        setIsModalOpen(true);
        setRecipient(recipient)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="w-full h-full overflow-auto">
            {error ? (
                <p>Wystąpił błąd podczas ładowania danych.</p>
            ) : houseMates.length > 0 ? (
                <table className="w-full h-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {houseMates.map((mate, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{mate.userName}</td>
                                <td className="px-4 py-2">{mate.role}</td>
                                <td className="px-4 py-2 flex gap-3">
                                    <button type="button" onClick={() => handleOpenModal(mate.userName)} className="w-fit h-fit" title='Send message'>
                                        <Icon icon='mdi-light:message' width={20} height={20} />
                                    </button>
                                    {mode === 'subpage' && (
                                        <>
                                            <button type="button" className="w-fit h-fit" title={`Show user's transactions`}>
                                                <Icon icon='hugeicons:transaction' width={20} height={20} />
                                            </button>
                                            <button
                                                type="button"
                                                className="w-fit h-fit"
                                                hidden={user.role !== 'superadmin'}
                                                title="Delete housemate"
                                            >
                                                <Icon icon='mi:delete' width={20} height={20} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Brak domowników</p>
            )}
            <SendMessageModal isOpen={isModalOpen} onRequestClose={handleCloseModal} recipient={recipient} />
        </div>
    );
}
