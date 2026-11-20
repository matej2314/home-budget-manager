import { useState, useRef, useContext } from "react"
import { apiBaseUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { CountDeclaredBudgetPeriod } from '../../utils/countingUtils/CountDeclaredBudgetPeriod';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { isNoSQL, isNoXSS, isValidNumber } from "../../utils/validation";
import LoadingModal from "../modals/LoadingModal";
import useApiResponseHandler from "../../hooks/useApiResponseHandler";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import SubmitBtn from "./internal/SubmitBtn";
import { DataContext } from '../../store/dataContext';

export default function DeclareBudgetForm({ onRequestClose, embedded = false }) {
    const [declarationStatus, setDeclarationStatus] = useState({
        sended: false,
        isLoading: false,
    });
    const { refreshData } = useContext(DataContext);
    const handleApiResponse = useApiResponseHandler();
    const { t } = useTranslation("forms");
    const declaredBudgetRef = useRef();
    const declaredPeriod = CountDeclaredBudgetPeriod();

    const handleDeclareBudget = async (e) => {
        e.preventDefault();

        const declaredBudget = declaredBudgetRef.current.value.trim().replace(',', '.');

        if (!declaredBudget || !isNoSQL(declaredBudget) || !isNoXSS(declaredBudget) || !isValidNumber(declaredBudget)) {
            showInfoToast(t("declareBudget.inputError"));
            return;
        };

        const budgetData = {
            value: +parseFloat(declaredBudget).toFixed(2),
        };

        try {
            setDeclarationStatus({ sended: false, isLoading: true });

            const addBudget = await sendRequest('POST', budgetData, `${apiBaseUrl}/initmonthly/new`);

            handleApiResponse(addBudget, {
                onSuccess: async () => {
                    showInfoToast(t(addBudget.message, { defaultValue: "declareBudget.declaredCorrectlyMessage" }));
                    await refreshData();
                    if (onRequestClose) setTimeout(onRequestClose, 600);
                },
                onError: () => {
                    showErrorToast(t(addBudget.message, { defaultValue: "declareBudget.declareInternalError" }));
                }
            });

        } catch (error) {
            console.error(error);
        } finally {
            setDeclarationStatus({ sended: true, isLoading: false });
        }
    }

    return (
        <>
            {!embedded && (
                <h2 className="text-lg font-semibold text-ink text-center mb-3">{t("declareBudget.formHeader")}</h2>
            )}
            <form onSubmit={handleDeclareBudget}
                className="w-full flex flex-col gap-4"
            >
                <label htmlFor="initBudget" className="text-sm font-medium text-ink">{t("declareBudget.valueLabel")}</label>
                <div className="relative w-full">
                    <input
                        type="text"
                        name="initBudget"
                        id="initBudget"
                        ref={declaredBudgetRef}
                        placeholder={t("declareBudget.valuePlaceholder")}
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className="input-base pr-9"
                    />
                    <Icon
                        icon='tdesign:money'
                        className="icon-base top-2.5 text-muted text-lg"
                    />
                </div>
                <p className="text-sm text-muted">{t("declareBudget.periodParagraph")} {declaredPeriod.startPeriod} - {declaredPeriod.endPeriodString}</p>
                <div className="flex justify-end">
                    <SubmitBtn
                        className='form-submit-modal-btn'
                        disabled={declarationStatus.sended}
                    >
                        {t("declareBudget.declareSubmitBtn")}
                    </SubmitBtn>
                </div>
            </form>
            {declarationStatus.isLoading && <LoadingModal isOpen={declarationStatus.isLoading} />}
        </>
    )
}