import { useContext } from 'react';
import { useAuth } from '../../store/authContext';
import { DataContext } from '../../store/dataContext';
import { useTranslation } from 'react-i18next';
import AppModal from './AppModal';
import ModalHeader from './ModalHeader';

export default function TransactionsCategoriesModal({ isOpen, onRequestClose }) {
    const { data, isLoading, dataError: error } = useContext(DataContext);
    const actionCats = !isLoading && !error && data.actionsCatData || [];
    const { user } = useAuth();
    const { t } = useTranslation("common");

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Categories"
            className="modal-panel max-w-2xl"
        >
            <ModalHeader title="Available transactions categories" onClose={onRequestClose} />
            <div id="categories-list">
                {!isLoading && !error && data ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {actionCats.map((cat) => (
                            <li
                                key={cat.id}
                                data-id={cat.id}
                                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-page px-3 py-2.5 text-sm"
                            >
                                <span className="font-medium text-ink">{t(`actionCats.${cat.name}`)}</span>
                                {user && user.role === 'superadmin' && (
                                    <button
                                        type="button"
                                        className="modal-btn-secondary px-2.5 py-1 text-xs"
                                    >
                                        Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted">Brak kategorii.</p>
                )}
            </div>
        </AppModal>
    )
}
