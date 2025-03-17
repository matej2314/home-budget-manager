import { useState, useRef } from "react"
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { CountDeclaredBudgetPeriod } from '../../utils/countingUtils/CountDeclaredBudgetPeriod';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from "../modals/LoadingModal";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import SubmitBtn from "./internal/SubmitBtn";


export default function DeclareBudgetForm() {
    const [sended, setSended] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation("forms");
    const declaredBudgetRef = useRef();
    const declaredPeriod = CountDeclaredBudgetPeriod();
    const lettersRegex = /[^0-9.,]/;

    const handleDeclareBudget = async (e) => {
        e.preventDefault();

        if (!declaredBudgetRef.current.value || lettersRegex.test(declaredBudgetRef.current.value.trim())) {
            showInfoToast(t("declareBudget.inputError"));
            return;
        };

        const budgetValue = declaredBudgetRef.current.value.trim().replace(',', '.');

        const budgetData = {
            value: +parseFloat(budgetValue).toFixed(2),
        };

        try {
            setSended(false);
            setIsLoading(true);
            const addBudget = await sendRequest('POST', budgetData, `${serverUrl}/initmonthly/new`);

            if (addBudget.status === 'error') {
                showErrorToast(t(addBudget.message, { defaultValue: "declareBudget.declareInternalError" }));
            } else if (addBudget.status === 'success') {
                showInfoToast(t(addBudget.message, { defaultValue: "declareBudget.declaredCorrectlyMessage" }));
                setTimeout(() => {
                    onRequestClose();
                }, 600);
            };
        } catch (error) {
            console.error(error);
        } finally {
            setSended(true);
            setIsLoading(false);
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
                    disabled={sended}
                >
                    {t("declareBudget.declareSubmitBtn")}
                </SubmitBtn>
                <p>{t("declareBudget.periodParagraph")} {declaredPeriod.startPeriod} - {declaredPeriod.endPeriodString}</p>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </>
    )
}