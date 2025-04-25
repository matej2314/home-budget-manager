import { useContext } from 'react';
import { AuthContext } from '@store/authContext';
import {useModal} from '@hooks/useModal';
import { Icon } from '@iconify/react';
import { useMediaQuery } from 'react-responsive';
import LoadingModal from '@components/modals/LoadingModal';
import { tableLabels } from '@utils/arraysUtils/actionsTableLabels';
import { formatDbDate } from '@utils/formattingUtils/formatDateToDisplay';
import { filterArray } from '@utils/arraysUtils/arraysFunctions';
import { useTranslation } from 'react-i18next';
import DeleteTransactionModal from '@components/modals/DeleteTransactionModal';
import { type Transaction } from '@models/transactionsStoreTypes';
import { type AuthContextType } from '@models/authTypes';

export type TransactionsListInput = {
    limit?: number;
    mainSite: boolean;
    filterId?: string;
    transactions: Transaction[];
    actionsLoading?: boolean;
    actionsError?: string | null;
    actionsTotalPages?: number;
    getTransactions?: (page: number) => void;
}

export default function TransactionsList({ limit, mainSite, filterId, transactions, actionsLoading, actionsError, actionsTotalPages, getTransactions }: TransactionsListInput) {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { modal, openModal, closeModal } = useModal<Transaction>({ isOpen: false, modalType: 'delete', data: null });
    const { t: tInternal } = useTranslation("dashboardInternal");
    const { t: tUtils } = useTranslation("utils");
    const { user } = useContext(AuthContext) as AuthContextType;

    const filteredTransactions: Transaction[] = filterId ? filterArray(transactions, (transaction) => transaction.userId === filterId) : transactions;
    const sortedTransactions = Array.isArray(filteredTransactions)
        ? [...filteredTransactions].sort((a: Transaction, b: Transaction) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        : [];
    const transactionsToDisplay: Transaction[] = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;

    const handleDeleteAction = (transaction: Transaction) => {
        openModal('delete', transaction);
    };

    return (
        <div className="w-full h-full overflow-auto pb-4">
            <div className='w-full h-fit flex justify-end gap-3 pr-5 mb-2'>
                {Array.from({ length: actionsTotalPages as number }, (_, index) => (
                    <button
                        key={index}
                        className=''
                        onClick={() => getTransactions?.(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            {!actionsLoading && !actionsError ? (
                <table className={`${mainSite ? 'w-[97%] mx-auto' : 'w-full'} transactions-list-table`}>
                    <thead className='text-[0.6rem] indirect:text-sm md:text-sm'>
                        <tr className={`border-b ${mainSite ? 'bg-slate-400/50' : 'bg-slate-400/80'}`}>
                            {tableLabels.map((label, index) => (
                                <th
                                    key={index}
                                    className={`
                                    ${index === 0 ? 'rounded-tl-xl' : ''} 
                                    ${mainSite && index === tableLabels.length - 1 ? 'rounded-tr-xl' : ''}`}
                                >
                                    {tUtils(`actionsTableLabels.${label}`)}
                                </th>
                            ))}
                            {!mainSite && <th className="px-4 py-2 text-center rounded-tr-xl">{tInternal("transactionsList.actionsHeaderValue")}</th>}
                        </tr>
                    </thead>
                    <tbody className="border-x-[1px] border-slate-400 text-[0.6rem] indirect:text-sm md:text-sm text-center">
                        {transactionsToDisplay.map((transaction: Transaction, index: number) => (
                            <tr key={transaction.transactionId}
                                className={`border-b ${index === transactionsToDisplay.length - 1 ? 'border-b-2 border-slate-400' : 'border-none'}`}>
                                <td className="pl-2 transactions-list-table-data">{`${transaction.value} zł`}</td>
                                <td className="transactions-list-table-data">{tInternal(`transactionsList.types.${transaction.type}`)}</td>
                                <td className="transactions-list-table-data">{transaction.categoryName}</td>
                                <td className="transactions-list-table-data">{transaction.userName}</td>
                                <td className="transactions-list-table-data">
                                    {!isMobile ? formatDbDate(transaction.addedAt, undefined) : formatDbDate(transaction.addedAt, true)}
                                </td>
                                {!mainSite && transaction.userName === user.userName && (
                                    <td>
                                        <button
                                            type="button"
                                            className="w-fit h-fit"
                                            onClick={() => handleDeleteAction(transaction)}
                                            title={tInternal("transactionsList.deleteBtnTitle")}
                                        >
                                            <Icon icon='material-symbols:delete-outline' width={20} height={20} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>{tInternal("transactionsList.noActionsError")}</p>
            )}
            {actionsLoading && <LoadingModal isOpen={actionsLoading} />}
            {modal && modal.isOpen && modal.modalType === 'delete' && <DeleteTransactionModal isOpen={modal.isOpen} onRequestClose={closeModal} transaction={modal.data as Transaction} />}
        </div>
    );
}
