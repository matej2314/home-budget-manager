import { useRef, useContext, useState } from 'react';
import { DataContext } from '../../store/dataContext';
import { Icon } from '@iconify/react';
import { serverUrl } from '../../url';
import { useTransactionsStore } from '../../store/transactionsStore';
import { useTranslation } from 'react-i18next';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import useOcrRecognition from '../../hooks/useOcrRecognition';
import SubmitBtn from './internal/SubmitBtn';
import { isValidNumber } from '../../utils/validation';

export default function AddTransactionForm({ onClose }) {
    const { data, isLoading, error } = useContext(DataContext);
    const actionCategories = !isLoading && !error && data.actionsCatData || [];
    const { fetchTransactions } = useTransactionsStore();
    const handleApiResponse = useApiResponseHandler();
    const [imageMode, setImageMode] = useState(false);
    const { recognizeValueFromFile, loadingImage, recognizedValue } = useOcrRecognition();
    const { t: tForms } = useTranslation("forms");
    const { t: tCommon } = useTranslation("common");
    const typeRef = useRef();
    const numberValueRef = useRef();
    const fileValueRef = useRef();
    const catIdRef = useRef();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        await recognizeValueFromFile(file);
        setImageMode(false);
    };

    const handleToggleImageMode = () => {
        setImageMode(prevMode => !prevMode);
    };

    const handleSaveAction = async (e) => {
        e.preventDefault();

        let rawValue = numberValueRef.current.value.replace(',', '.');

        if (!isValidNumber(rawValue)) {
            showErrorToast(tForms("addTransaction.incorrectNumberInputValue"));
            return;
        };

        const parsedValue = parseFloat(rawValue);

        const newActionData = {
            type: typeRef.current.value,
            value: parsedValue.toFixed(2),
            catId: catIdRef.current.selectedOptions[0].dataset.id,
        };

        const saveAction = await sendRequest('POST', newActionData, `${serverUrl}/action/new`);

        handleApiResponse(saveAction, {
            onSuccess: async () => {
                showInfoToast(tForms(saveAction.message, { defaultValue: "addTransaction.addTransactionCorrect" }));
                await fetchTransactions();
                setTimeout(onClose, 500);
            },
            onError: () => {
                showErrorToast(tForms(saveAction.message, { defaultValue: "addTransaction.addTransactionError" }));
            }
        });
    };

    return (
        <div className='w-full h-fit flex flex-col items-center'>
            <form onSubmit={handleSaveAction} className='w-full h-fit flex flex-col items-center gap-5 text-xs indirect:text-base'>
                <label htmlFor="actionType" className='text-lg font-semibold'>{tForms("addTransaction.typeActionLabel")}</label>
                <select
                    name="actionType"
                    id="actionType"
                    ref={typeRef}
                    className='border-2 border-slate-300 rounded-md'
                    required>
                    <option value="income">{tForms("addTransaction.incomeType")}</option>
                    <option value="expense">{tForms("addTransaction.expenseType")}</option>
                </select>
                <label htmlFor="actionValue" className='text-lg font-semibold'>{imageMode ? tForms("addTransaction.actionValueImageLabel") :
                    tForms("addTransaction.actionValueNumberLabel")}</label>
                <div className='w-full h-fit flex justify-center items-center gap-3'>
                    {!imageMode ?
                        <input
                            type='text'
                            name="actionValue"
                            id="actionValue"
                            ref={numberValueRef}
                            defaultValue={recognizedValue ? recognizedValue : ''}
                            className='input-base text-black'
                            placeholder={tForms("addTransaction.textInputPlaceholder")}
                            required /> :
                        <input
                            type="file"
                            name="actionValue"
                            id="actionValue"
                            ref={fileValueRef}
                            className='pl-2'
                            onChange={imageMode && handleFileChange}
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
                            <option key={cat.id} data-id={cat.id} value={cat.name}>{tCommon(`actionCats.${cat.name}`)}</option>
                        ))
                    ) : (
                        <option value="error">error</option>
                    )}
                </select>
                <SubmitBtn
                    className='form-submit-modal-btn'
                    disabled={isLoading}
                >
                    {tForms("addTransaction.submitTransaction")}
                </SubmitBtn>
            </form>
            {loadingImage && <LoadingModal isOpen={loadingImage} />}
        </div>
    )

}