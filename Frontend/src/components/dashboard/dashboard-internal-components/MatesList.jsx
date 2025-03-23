import { useContext, useState } from "react";
import { AuthContext } from "../../../store/authContext";
import { DataContext } from "../../../store/dataContext";
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { SendMessageModal } from "../../modals/messagesModals/messagesModals";
import { showInfoToast } from "../../../configs/toastify";
import { getData } from "../../../utils/getData";

export default function MatesList({ mode }) {
    const { t } = useTranslation("dashboardInternal");
    const { user, isAuthenticated } = useContext(AuthContext);
    const { data, isLoading, error } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipient, setRecipient] = useState(null);

    const houseMates = getData(isLoading, error, true, data.houseMates, []);
    const thLabels = ['Name', 'Role', 'Actions'];

    const handleOpenModal = (recipient) => {
        setIsModalOpen(true);
        setRecipient(recipient)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`${mode === 'subpage' ? 'w-11/12' : 'w-full'} h-full overflow-auto`}>
            {error ? (
                <p>{t("matesList.loadingError")}</p>
            ) : houseMates.length > 0 ? (
                <table className={`${mode === 'subpage' ? 'w-11/12 mx-auto' : 'w-[100%] mx-auto'} h-full table-auto text-sm`}>
                    <thead>
                        <tr className={`w-full ${mode === 'subpage' ? 'bg-slate-400/80' : 'bg-slate-400/50'}`}>
                            {thLabels.map((label, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-2 text-center 
                    ${index === 0 ? 'rounded-tl-xl' : ''} 
                    ${index === thLabels.length - 1 ? 'rounded-tr-xl' : ''}`}
                                >
                                    {t(`matesList.thLabels.${label}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="w-full">
                        {houseMates.map((mate, index) => (
                            <tr key={index} className="w-11/12 border-[1px] border-slate-400">
                                <td className="mates-list-table-data-base text-center">{mate.userName}</td>
                                <td className="mates-list-table-data-base text-center">{t(`matesList.${mate.role}`)}</td>
                                <td className="mates-list-table-data-base flex justify-center gap-3">
                                    <button type="button"
                                        onClick={() => handleOpenModal(mate.userName)}
                                        className="w-fit h-fit" title={t("matesList.messageBtnTitle")}>
                                        <Icon icon='mdi-light:message' width={20} height={20} />
                                    </button>
                                    {mode === 'subpage' && (
                                        <>
                                            <button type="button" className="w-fit h-fit" title={t("matesList.actionsBtnTitle")}>
                                                <Icon icon='hugeicons:transaction' width={20} height={20} />
                                            </button>
                                            <button
                                                type="button"
                                                className="w-fit h-fit"
                                                hidden={user.role !== 'superadmin'}
                                                title={t("matesList.deleteBtnTitle")}
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
                <p>{t("matesList.noHousematesError")}</p>
            )}
            {isAuthenticated && user.userName !== recipient ?
                <SendMessageModal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    recipient={recipient} /> : showInfoToast(t("matesList.selfSendError"))}
        </div>
    );
}
