import { useRef, useContext, useState, useEffect } from 'react';
import { DataContext } from '../../store/dataContext';
import { Icon } from '@iconify/react';
import { apiBaseUrl } from '../../url';
import { useTransactionsStore } from '../../store/transactionsStore';
import { useTranslation } from 'react-i18next';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { resolveApiMessage } from '../../utils/asyncUtils/parseApiEnvelope';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import useOcrRecognition from '../../hooks/useOcrRecognition';
import SubmitBtn from './internal/SubmitBtn';
import { isAmount2dp } from '../../utils/validation';

export default function AddTransactionForm({ onClose }) {
    const { data, isLoading, dataError, refreshData } = useContext(DataContext);
    const actionCategories = (!isLoading && !dataError && data.actionsCatData) || [];
    const { fetchTransactions } = useTransactionsStore();
    const handleApiResponse = useApiResponseHandler();
    const [imageMode, setImageMode] = useState(false);
    const [type, setType] = useState('expense');
    const [value, setValue] = useState('');
    const { recognizeValueFromFile, loadingImage, recognizedValue } = useOcrRecognition();
    const { t: tForms } = useTranslation("forms");
    const { t: tCommon } = useTranslation("common");
    const { t: tModals } = useTranslation("modals");
    const fileValueRef = useRef();
    const catIdRef = useRef();

    useEffect(() => {
        if (recognizedValue) {
            setValue(String(recognizedValue));
            setImageMode(false);
        }
    }, [recognizedValue]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await recognizeValueFromFile(file);
    };

    const handleSaveAction = async (e) => {
        e.preventDefault();

        const rawValue = String(value).trim().replace(',', '.');

        if (!isAmount2dp(rawValue)) {
            showErrorToast(tForms("addTransaction.tooManyDecimalPlaces"));
            return;
        }

        const selectedOption = catIdRef.current?.selectedOptions?.[0];
        if (!selectedOption?.dataset?.id) {
            showErrorToast(tForms("addTransaction.addTransactionError"));
            return;
        }

        const newActionData = {
            type,
            value: rawValue,
            catId: selectedOption.dataset.id,
        };

        try {
            const saveAction = await sendRequest('POST', newActionData, `${apiBaseUrl}/action/new`);

            handleApiResponse(saveAction, {
                onSuccess: async (envelope) => {
                    showInfoToast(
                        resolveApiMessage(
                            envelope.messageKey,
                            tForms('addTransaction.addTransactionCorrect'),
                        ),
                    );
                    await fetchTransactions();
                    await refreshData();
                    setTimeout(onClose, 500);
                },
                onError: (envelope) => {
                    showErrorToast(
                        resolveApiMessage(
                            envelope.messageKey,
                            tForms('addTransaction.addTransactionError'),
                        ),
                    );
                }
            });
        } catch (error) {
            if (error?.notified) return;
            showErrorToast(
                resolveApiMessage(
                    error?.message,
                    tForms('addTransaction.addTransactionError'),
                ),
            );
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSaveAction} className="w-full flex flex-col gap-5">
                <fieldset>
                    <legend className="text-sm font-medium text-ink mb-2">
                        {tForms("addTransaction.typeActionLabel")}
                    </legend>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-page border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${type === 'income'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'text-muted hover:text-ink hover:bg-white'
                                }`}
                        >
                            <Icon icon="mdi:trending-up" width={18} height={18} />
                            {tForms("addTransaction.incomeType")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${type === 'expense'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'text-muted hover:text-ink hover:bg-white'
                                }`}
                        >
                            <Icon icon="mdi:trending-down" width={18} height={18} />
                            {tForms("addTransaction.expenseType")}
                        </button>
                    </div>
                </fieldset>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <label htmlFor="actionValue" className="text-sm font-medium text-ink">
                            {imageMode
                                ? tForms("addTransaction.actionValueImageLabel")
                                : tForms("addTransaction.actionValueNumberLabel")}
                        </label>
                        <button
                            type="button"
                            onClick={() => setImageMode((prev) => !prev)}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${imageMode
                                ? 'border-accent bg-accent-soft text-accent'
                                : 'border-slate-200 text-muted hover:text-accent hover:border-accent/40 hover:bg-accent-soft'
                                }`}
                        >
                            <Icon icon="mdi:camera-outline" width={16} height={16} />
                            {tForms("addTransaction.scanToggle")}
                        </button>
                    </div>

                    {!imageMode ? (
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="decimal"
                                name="actionValue"
                                id="actionValue"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="input-base pr-12 text-base font-semibold tracking-tight"
                                placeholder={tForms("addTransaction.textInputPlaceholder")}
                                required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted pointer-events-none">
                                zł
                            </span>
                        </div>
                    ) : (
                        <label
                            htmlFor="actionValueFile"
                            className="flex flex-col items-center justify-center gap-2 w-full min-h-[7rem] rounded-xl border border-dashed border-slate-300 bg-page px-4 py-5 text-center cursor-pointer hover:border-accent/50 hover:bg-accent-soft/40 transition-colors"
                        >
                            <Icon icon="mdi:file-image-outline" width={28} height={28} className="text-accent" />
                            <span className="text-sm text-ink font-medium">
                                {tForms("addTransaction.actionValueImageLabel")}
                            </span>
                            <span className="text-xs text-muted">JPG, PNG</span>
                            <input
                                type="file"
                                accept="image/*"
                                name="actionValueFile"
                                id="actionValueFile"
                                ref={fileValueRef}
                                className="sr-only"
                                onChange={handleFileChange}
                                disabled={loadingImage}
                            />
                        </label>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="actionCat" className="text-sm font-medium text-ink">
                        {tForms("addTransaction.categoryLabel")}
                    </label>
                    <select
                        name="actionCat"
                        id="actionCat"
                        ref={catIdRef}
                        className="input-base appearance-none bg-white"
                        required
                        disabled={isLoading || !!dataError || actionCategories.length === 0}
                    >
                        {actionCategories.length > 0 ? (
                            actionCategories.map((cat) => (
                                <option key={cat.id} data-id={cat.id} value={cat.name}>
                                    {tCommon(`actionCats.${cat.name}`)}
                                </option>
                            ))
                        ) : (
                            <option value="">{tForms("addTransaction.categoryEmpty")}</option>
                        )}
                    </select>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="modal-btn-secondary"
                    >
                        {tModals("cancel")}
                    </button>
                    <SubmitBtn
                        className="form-submit-modal-btn"
                        disabled={isLoading || loadingImage || actionCategories.length === 0}
                    >
                        {tForms("addTransaction.submitTransaction")}
                    </SubmitBtn>
                </div>
            </form>
            {loadingImage && <LoadingModal isOpen={loadingImage} />}
        </div>
    );
}
