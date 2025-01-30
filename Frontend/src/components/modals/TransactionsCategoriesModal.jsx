import { useContext } from 'react';
import { DataContext } from '../../store/dataContext';
import Modal from 'react-modal';

export default function TransactionsCategoriesModal({ isOpen, onRequestClose }) {
    const { data, isLoading, error } = useContext(DataContext);
    const actionCats = !isLoading && !error && data.dashboardData.actionsCatData || [];

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-300 rounded-lg p-6 w-1/3 h-fit mx-auto my-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <div id="categories-list" className='flex flex-col items-center'>
                <ul className="w-full h-fit flex flex-col items-center justify-center gap-3">
                    {!isLoading && !error && data ? (
                        actionCats.map((cat) => (
                            <li key={cat.id} data-id={cat.id} className="w-full h-fit flex justify-center gap-2">
                                <span>{cat.name}</span> -
                                <span>{cat.type}</span>
                            </li>
                        ))
                    ) : (
                        <p>Brak kategorii.</p>
                    )}
                </ul>
            </div>
        </Modal>
    )
}