import { useContext } from "react";
import { AuthContext } from "../../../store/authContext";
import { DataContext } from "../../../store/dataContext";
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
// import { SendMessageModal } from "../../modals/messagesModals/messagesModals";
// import UserTransactionsModal from '../../modals/UserTransactionsModal';
import { useModal } from "@hooks/useModal";
import { thLabels } from "../../../utils/matesListUtils";
import { showInfoToast } from "../../../configs/toastify";
import { getData } from "../../../utils/getData";

type MatesListInput = {
    mode: string;
};

export default function MatesList({ mode }: MatesListInput) {
    const { t } = useTranslation("dashboardInternal");
    const { user } = useContext(AuthContext)!;
    const { data, isLoading, contextError } = useContext(DataContext);
    const { modal, openModal, closeModal } = useModal<string>({ isOpen: false, modalType: '', data: null });
    const houseMates = getData(isLoading, String(contextError), true, data.houseMates, []);

    const handleOpenMsgModal = (recipient: string) => {
        if (user.userName === recipient) {
            showInfoToast(t("matesList.selfSendError"));
            return;
        }
        openModal('message', recipient);
    }

    return (
        <div className={`${mode === 'subpage' ? 'w-11/12' : 'w-full'} h-full overflow-auto`}>
            {contextError ? (
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
                        {houseMates.map((mate) => (
                            <tr key={mate.userId} className="w-11/12 border-[1px] border-slate-400">
                                <td className="mates-list-table-data-base text-center">{mate.userName}</td>
                                <td className="mates-list-table-data-base text-center">{t(`matesList.${mate.role}`)}</td>
                                <td className="mates-list-table-data-base flex justify-center gap-3">
                                    <button type="button"
                                        onClick={() => handleOpenMsgModal(mate.userName)}
                                        className="w-fit h-fit" title={t("matesList.messageBtnTitle")}>
                                        <Icon icon='mdi-light:message' width={20} height={20} />
                                    </button>
                                    {mode === 'subpage' && (
                                        <>
                                            <button
                                                type="button"
                                                className="w-fit h-fit"
                                                title={t("matesList.actionsBtnTitle")}
                                                onClick={() => openModal('actions', mate.userId)}
                                            >
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
            {modal && modal.isOpen && modal.type === 'message' &&
                <SendMessageModal
                    isOpen={modal.isOpen}
                    onRequestClose={closeModal}
                    recipient={modal.data} />

            }
            {modal && modal.isOpen && modal.type === 'actions' &&
                <UserTransactionsModal
                    isOpen={modal.isOpen}
                    onRequestClose={closeModal}
                    id={modal.data}
                />
            }
        </div>
    );
}
