import { useState, useRef, FormEvent } from "react"
import { serverUrl } from '../../configs/url';
import { useMutation } from "@tanstack/react-query";
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { countDeclaredBudgetPeriod } from "@utils/countingUtils/countDeclaredBudgetPeriod";
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { isValidNumber } from "../../utils/validation";
import LoadingModal from "../modals/LoadingModal";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import SubmitBtn from "./internal/SubmitBtn";
import { BaseApiResponse } from "@utils/asyncUtils/fetchData";

interface BudgetDataPayload {
    value: number;
};

const declareBudgetRequest = async (value: number) => {
    const budgetData: BudgetDataPayload = { value };
    return await sendRequest<BudgetDataPayload, BaseApiResponse>('POST', budgetData, `${serverUrl}/initmonthly/new`);
};

export default function DeclareBudgetForm() {
    const { t } = useTranslation("forms");
    const declaredBudgetRef = useRef<HTMLInputElement>(null);
    const declaredPeriod = countDeclaredBudgetPeriod();
    const [sended, setSended] = useState<boolean>(false);
    
    const mutation = useMutation({
        mutationFn: declareBudgetRequest,
        onMutate: () => {
            setSended(false);
        },
        onSuccess: (data: BaseApiResponse) => {
            if (data.status === 'success') {
                showInfoToast(t(data.message, { defaultValue: "declareBudget.declaredCorrectlyMessage" }));
            } else if (data.status === 'error') {
                showErrorToast(t(data.message, { defaultValue: "declareBudget.declareInternalError" }));
            }
        },
        onError: (error: Error | string) => {
            showErrorToast(t("declareBudget.error"));
            console.error(error);
        },
        onSettled: () => {
            setSended(true);
        },
    });

    const handleDeclareBudget = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const declaredBudget = declaredBudgetRef.current?.value.trim().replace(',', '.');
    
        if (!declaredBudget || !isValidNumber(declaredBudget)) {
            showInfoToast(t("declareBudget.inputError"));
            return;
        };
    
        const budgetData: BudgetDataPayload = {
            value: +parseFloat(declaredBudget).toFixed(2),
        };
    
        mutation.mutate(budgetData.value);
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
                        onInput={(e: FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            const icon = input.nextSibling as HTMLElement;
                            icon.style.display = input.value ? 'none' : 'block';
                        }}
                        className="input-base"
                    />
                    <Icon
                        icon='tdesign:money'
                        className="icon-base top-0.5 text-gray-500 text-xl text-opacity-40"
                    />
                </div>
                <SubmitBtn
                    className='form-submit-modal-btn'
                    disabled={sended} // Zablokowanie przycisku podczas ładowania
                >
                    {t("declareBudget.declareSubmitBtn")}
                </SubmitBtn>
                <p>{t("declareBudget.periodParagraph")} {declaredPeriod.startPeriod} - {declaredPeriod.endPeriodString}</p>
            </form>
            {mutation.isPending && <LoadingModal isOpen={mutation.isPending} />}
        </>
    )
}