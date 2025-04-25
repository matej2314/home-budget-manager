import { useContext } from 'react';
import { AuthContext } from '../../store/authContext';
import { DataContext } from '../../store/dataContext';
import { useTranslation } from 'react-i18next';
import { type AuthContextType } from '@models/authTypes';
import Modal from 'react-modal';

interface TransactionsCategoriesModal {
    isOpen: boolean;
    onRequestClose: () => void;
}


export default function TransactionsCategoriesModal({ isOpen, onRequestClose }: TransactionsCategoriesModal) {
    const { data, isLoading, contextError:error } = useContext(DataContext);
    const actionCats = !isLoading && !error && data.actionsCatData || [];
    const { user } = useContext(AuthContext) as AuthContextType;
    const { t } = useTranslation("common");

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-300 rounded-lg p-6 w-9/12 h-fit mx-auto my-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <div className='w-full flex justify-end -translate-y-[1.5rem] translate-x-4'>
                <button
                    type="button"
                    onClick={onRequestClose}
                >
                    X
                </button>
            </div>

            <div id="categories-list" className='flex flex-col justify-center items-center'>
                <h2 className='w-full flex justify-center text-xl'>Available transactions categories:</h2>
                <ul className="w-full grid grid-cols-4 lg:grid-cols-2 grid-rows-auto gap-y-2 mt-5">
                    {!isLoading && !error && data ? (
                        actionCats.map((cat) => (
                            <li key={cat.id} data-id={cat.id} className="w-6/12 h-fit flex justify-between items-center gap-3 mx-auto text-sm lg:text-base">
                                <span className='w-full h-fit flex'>{t(`actionCats.${cat.name}`)}</span>
                                {user && user.role === 'superadmin' && -<button type="button" className='w-fit h-fit p-2 bg-slate-400 rounded-xl hover:bg-slate-300 border-[1px] border-slate-600'>Delete</button>}
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