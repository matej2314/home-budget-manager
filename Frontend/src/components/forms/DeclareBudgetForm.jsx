import { useState, useRef } from "react"
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { CountDeclaredBudgetPeriod } from '../../utils/countingUtils/CountDeclaredBudgetPeriod';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { isNoSQL, isNoXSS, isValidNumber } from "../../utils/validation";
import LoadingModal from "../modals/LoadingModal";
import useApiResponseHandler from "../../hooks/useApiResponseHandler";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import SubmitBtn from "./internal/SubmitBtn";


export default function DeclareBudgetForm() {
    const [declarationStatus, setDeclarationStatus] = useState({
        sended: false,
        isLoading: false,
    });
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

            const addBudget = await sendRequest('POST', budgetData, `${serverUrl}/initmonthly/new`);

            handleApiResponse(addBudget, {
                onSuccess: () => {
                    showInfoToast(t(addBudget.message, { defaultValue: "declareBudget.declaredCorrectlyMessage" }));
                    setTimeout(onRequestClose, 600);
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
            <h2 className='w-full h-fit flex justify-center font-semibold'>{t("declareBudget.formHeader")}</h2>
            <form onSubmit={handleDeclareBudget}
                className='w-full h-fit flex flex-col items-center gap-3 mt-3'
            >
                <label htmlFor="initBudget">{t("declareBudget.valueLabel")}</label>
                <div className="relative w-fit">
                    <input
                        type="text"
                        name="initBudget"
                        id="initBudget"
                        ref={declaredBudgetRef}
                        placeholder={t("declareBudget.valuePlaceholder")}
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className="input-base"
                    />
                    <Icon
                        icon='tdesign:money'
                        className="icon-base top-0.5 text-gray-500 text-xl text-opacity-40"
                    />
                </div>
                <SubmitBtn
                    className='form-submit-modal-btn'
                    disabled={declarationStatus.sended}
                >
                    {t("declareBudget.declareSubmitBtn")}
                </SubmitBtn>
                <p>{t("declareBudget.periodParagraph")} {declaredPeriod.startPeriod} - {declaredPeriod.endPeriodString}</p>
            </form>
            {declarationStatus.isLoading && <LoadingModal isOpen={declarationStatus.isLoading} />}
        </>
    )
}