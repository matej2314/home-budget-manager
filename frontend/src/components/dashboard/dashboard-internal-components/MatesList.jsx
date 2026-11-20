import { useContext } from "react";
import { useAuth } from "../../../store/authContext";
import { DataContext } from "../../../store/dataContext";
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { SendMessageModal } from "../../modals/messagesModals/messagesModals";
import UserTransactionsModal from '../../modals/UserTransactionsModal';
import useModal from "../../../hooks/useModal";
import { thLabels } from "../../../utils/matesListUtils";
import { showInfoToast } from "../../../configs/toastify";
import { getData } from "../../../utils/getData";
import { isHostRole } from "../../../utils/checkUserRole";

export default function MatesList({ mode }) {
    const { t } = useTranslation("dashboardInternal");
    const { user } = useAuth();
    const { data, isLoading, dataError } = useContext(DataContext);
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null, data: null });
    const inmates = getData(isLoading, dataError, true, data.inmates, []);

    const handleOpenMsgModal = (recipient) => {
        if (user.userName === recipient) {
            showInfoToast(t("matesList.selfSendError"));
            return;
        }
        openModal('message', recipient);
    }

    return (
        <div className={`${mode === 'subpage' ? 'w-11/12' : 'w-full'} h-full overflow-auto`}>
            {dataError ? (
                <p>{t("matesList.loadingError")}</p>
            ) : inmates.length > 0 ? (
                <table className={`${mode === 'subpage' ? 'w-11/12 mx-auto' : 'w-full mx-auto'} h-full table-auto text-sm`}>
                    <thead>
                        <tr className="w-full bg-page text-muted">
                            {thLabels.map((label, index) => (
                                <th
                                    key={index}
                                    className={`px-3 sm:px-4 py-2.5 text-center font-medium text-xs sm:text-sm
                    ${index === 0 ? 'rounded-tl-lg' : ''} 
                    ${index === thLabels.length - 1 ? 'rounded-tr-lg' : ''}`}
                                >
                                    {t(`matesList.thLabels.${label}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="w-full">
                        {inmates.map((inmate) => (
                            <tr key={inmate.userId} className="border-b border-slate-100 hover:bg-page/80 transition-colors">
                                <td className="mates-list-table-data-base text-center">{inmate.userName}</td>
                                <td className="mates-list-table-data-base text-center">{t(`matesList.${inmate.role}`)}</td>
                                <td className="mates-list-table-data-base flex justify-center gap-3">
                                    <button type="button"
                                        onClick={() => handleOpenMsgModal(inmate.userName)}
                                        className="w-fit h-fit p-1.5 rounded-md text-muted hover:text-accent hover:bg-accent-soft transition-colors" title={t("matesList.messageBtnTitle")}>
                                        <Icon icon='mdi-light:message' width={20} height={20} />
                                    </button>
                                    {mode === 'subpage' && (
                                        <>
                                            <button
                                                type="button"
                                                className="w-fit h-fit"
                                                title={t("matesList.actionsBtnTitle")}
                                                onClick={() => openModal('actions', inmate.userId)}
                                            >
                                                <Icon icon='hugeicons:transaction' width={20} height={20} />
                                            </button>
                                            {/* Hint UX — usuwanie egzekwuje wyłącznie API; brak lokalnej reguły biznesowej / handlera SoT */}
                                            <button
                                                type="button"
                                                className="w-fit h-fit"
                                                hidden={!isHostRole(user)}
                                                title={t("matesList.deleteBtnTitle")}
                                                disabled
                                                aria-disabled="true"
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
                <p>{t("matesList.noInmatesError")}</p>
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
