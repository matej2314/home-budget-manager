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

    const houseMates = !isLoading && !error ? data.houseMates : [];
    const thLabels = ['Name', 'Role', 'Actions'];

    const handleOpenModal = (recipient) => {
        setIsModalOpen(true);
        setRecipient(recipient)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`${mode === 'subpage' && 'w-11/12'} h-full overflow-auto`}>
            {error ? (
                <p>Wystąpił błąd podczas ładowania danych.</p>
            ) : houseMates.length > 0 ? (
                <table className={`${mode === 'subpage' ? 'w-11/12' : 'w-[100%]'} h-full table-auto text-sm`}>
                    <thead>
                        <tr className={`w-full ${mode === 'subpage' ? 'bg-slate-400/80' : 'bg-slate-400/50'}`}>
                            {thLabels.map((label, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-2 text-center 
                    ${index === 0 ? 'rounded-tl-xl' : ''} 
                    ${index === thLabels.length - 1 ? 'rounded-tr-xl' : ''}`}
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="w-full">
                        {houseMates.map((mate, index) => (
                            <tr key={index} className="w-11/12 border-[1px] border-slate-400">
                                <td className="mx-auto py-2 text-center">{mate.userName}</td>
                                <td className="mx-auto py-2 text-center">{mate.role}</td>
                                <td className="mx-auto py-2 flex justify-center gap-3">
                                    <button type="button"
                                        onClick={() => handleOpenModal(mate.userName)}
                                        className="w-fit h-fit" title='Send message'>
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
            {isAuthenticated && user.userName !== recipient ?
                <SendMessageModal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    recipient={recipient} /> : null}
        </div>
    );
}
