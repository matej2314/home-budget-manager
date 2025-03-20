import { useRef, useContext, useState } from 'react';
import { DataContext } from '../../store/dataContext';
import { Icon } from '@iconify/react';
import { serverUrl } from '../../url';
import { useTransactionsStore } from '../../store/transactionsStore';
import { useTranslation } from 'react-i18next';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';
import SubmitBtn from './internal/SubmitBtn';
import { isValidNumber } from '../../utils/validation';

export default function AddTransactionForm({ onClose }) {
    const { data, isLoading, error } = useContext(DataContext);
    const actionCategories = !isLoading && !error && data.actionsCatData || [];
    const { fetchTransactions } = useTransactionsStore();
    const [imageMode, setImageMode] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [recognizedValue, setRecognizedValue] = useState();
    const { t } = useTranslation("forms");
    const typeRef = useRef();
    const numberValueRef = useRef();
    const fileValueRef = useRef();
    const catIdRef = useRef();

    const recognizeValue = async (e) => {
        e.preventDefault();
        const data = new FormData();
        const file = fileValueRef.current?.files[0];
        data.append('receipt', file);

        try {
            setLoadingImage(true)
            const recognize = await fetch(`${serverUrl}/receipt`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            });

            const recognizeData = await recognize.json();

            if (recognizeData.status === 'success') {
                setImageMode(false);
                setRecognizedValue(recognizeData.value.replace(',', '.'));

            } else if (recognizeData.status === 'error') {
                showErrorToast(t(recognizeData.message, { defaultValue: t("addTransaction.recognizeInternalError") }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingImage(false)
        }
    };


    const handleToggleImageMode = () => {
        setImageMode(prevMode => !prevMode);
    };

    const handleSaveAction = async (e) => {
        e.preventDefault();

        let rawValue = numberValueRef.current.value.replace(',', '.');

        if (!isValidNumber(rawValue)) {
            showErrorToast(t("addTransaction.incorrectNumberInputValue"));
            return;
        };

        const parsedValue = parseFloat(rawValue);

        const newActionData = {
            type: typeRef.current.value,
            value: parsedValue.toFixed(2),
            catId: catIdRef.current.selectedOptions[0].dataset.id,
        };

        const saveAction = await sendRequest('POST', newActionData, `${serverUrl}/action/new`);

        if (saveAction.status === 'success') {
            showInfoToast(t(saveAction.message, { defaultValue: "addTransaction.addTransactionCorrect" }));
            await fetchTransactions();
            setTimeout(() => {
                onClose();
            }, 500);
        } else if (saveAction.status === 'error') {
            showErrorToast(t(saveAction.message), { defaultValue: "addTransaction.addTransactionError" });
            onClose();
        }
    };


    return (
        <div className='w-full h-fit flex flex-col items-center'>
            <form onSubmit={handleSaveAction} className='w-full h-fit flex flex-col items-center gap-5 text-xs indirect:text-base'>
                <label htmlFor="actionType" className='text-lg font-semibold'>{t("addTransaction.typeActionLabel")}</label>
                <select
                    name="actionType"
                    id="actionType"
                    ref={typeRef}
                    className='border-2 border-slate-300 rounded-md'
                    required>
                    <option value="income">{t("addTransaction.incomeType")}</option>
                    <option value="expense">{t("addTransaction.expenseType")}</option>
                </select>
                <label htmlFor="actionValue" className='text-lg font-semibold'>{imageMode ? t("addTransaction.actionValueImageLabel") :
                    t("addTransaction.actionValueNumberLabel")}</label>
                <div className='w-full h-fit flex justify-center items-center gap-3'>
                    {!imageMode ?
                        <input
                            type='text'
                            name="actionValue"
                            id="actionValue"
                            ref={numberValueRef}
                            defaultValue={recognizedValue ? recognizedValue : ''}
                            className='input-base text-black'
                            placeholder={t("addTransaction.textInputPlaceholder")}
                            required /> :
                        <input
                            type="file"
                            name="actionValue"
                            id="actionValue"
                            ref={fileValueRef}
                            className='pl-2'
                            onChange={imageMode && recognizeValue}
                            disabled={loadingImage}
                            required />}
                    <button
                        type="button"
                        onClick={handleToggleImageMode}
                        className="form-submit-modal-btn"
                    >
                        <Icon icon='flat-color-icons:compact-camera' width={20} height={20} />
                    </button>
                </div>
                <select name="actionCat" id="actionCat" ref={catIdRef} className='border-2 border-slate-300 rounded-md'>
                    {!isLoading && !error ? (
                        actionCategories.map((cat) => (
                            <option key={cat.id} data-id={cat.id} value={cat.name}>{cat.name}</option>
                        ))
                    ) : (
                        <option value="error">error</option>
                    )}
                </select>
                <SubmitBtn
                    className='form-submit-modal-btn'
                    disabled={isLoading}
                >
                    {t("addTransaction.submitTransaction")}
                </SubmitBtn>
            </form>
            {loadingImage && <LoadingModal isOpen={loadingImage} />}
        </div>
    )

}