import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../../store/authContext';
import { DataContext } from '../../store/dataContext';
import { serverUrl } from '../../url';
import FastActions from '../../components/dashboard/dashboard-internal-components/FastActionsSection';
import TransactionsList from '../../components/dashboard/dashboard-internal-components/TransactionsList';
import MatesList from '../../components/dashboard/dashboard-internal-components/MatesList';
import { showInfoToast, showErrorToast } from '../../configs/toastify';

import DashboardHeader from '../../components/dashboard/dashboardComponents/DashBoardHeader';

export default function UserProfilePage() {
    const { fetchTransactions, actionsData, actionsError, actionsLoading } = useContext(DataContext);
    const transactions = Array.isArray(actionsData) ? actionsData : [];
    const { user, isAutnenticated } = useContext(AuthContext);
    const [type, setType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sended, setSended] = useState(false);
    const avatarFile = useRef();
    const uIdParam = null;

    const handleType = (type) => {
        setType(() => type);
    };

    const handleOpenModal = () => {
        setType('email');
        setIsModalOpen(true);

    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setType(null);
    }

    const handleChangeAvatar = async (e) => {
        e.preventDefault();

        if (avatarFile.current.files.length == 0) {
            showErrorToast('Wybierz plik!');
            return;
        }

        const avatarData = new FormData();

        avatarData.append('avatar', avatarFile.current.files[0]);

        try {
            setSended(false);
            const addAvatar = await fetch(`${serverUrl}/avatars/save`, {
                method: 'POST',
                body: avatarData,
                credentials: 'include',
            });

            const avatarResponse = await addAvatar.json();

            if (avatarResponse.status === 'success') {
                showInfoToast(avatarResponse.message);
                window.location.reload();
            } else if (avatarResponse.status === 'error') {
                showErrorToast(avatarResponse.message);
            }
        } catch (error) {
            showErrorToast(`Nie udało się zapisać avatara :(`);
        } finally {
            setSended(true);
        }
    };

    return (
        <>
            <div id="pagecontent" className="bg-slate-200 w-full h-screen overflow-auto no-scrollbar">
                <DashboardHeader />
                <div id="middle-content" className="w-full flex flex-col gap-5 py-4 px-5">
                    <div id='page-header' className='w-full h-fit flex justify-center items-center gap-7'>
                        <div className='w-28 h-28 flex rounded-full'>
                            <img src={user && `${serverUrl}/avatars/avatar`} className="rounded-full w-full h-full border-2 border-slate-100" />
                        </div>
                        <div className='flex flex-col items-center'>
                            <p className='text-xl'>{user.userName}</p>
                            <p>{user.role}</p>
                        </div>
                    </div>
                    <FastActions profilePage={true} action={handleType} openModal={handleOpenModal} />
                </div>
                {type === 'avatar' ? (
                    <>
                        <form
                            onSubmit={handleChangeAvatar}
                            className='w-1/2 h-fit flex flex-col items-center gap-3 mx-auto mt-5 border-2 border-slate-300 py-3 rounded-md shadow-lg shadow-slate-400'
                        >
                            <label htmlFor="avatar" className='text-lg font-semibold'>Select your avatar file:</label>
                            <input type="file" name="avatar" id="avatar" limit={1} accept='image/*' ref={avatarFile} />
                            <button
                                type="submit"
                                disabled={sended}
                                className='w-fit h-fit border-2 border-slate-400 rounded-md p-3 hover:bg-slate-400 hover:text-slate-50'
                            >
                                Save
                            </button>
                        </form>
                    </>
                ) : type === 'mates' ? (
                    <div className='w-8/12 h-fit flex justify-center shadow-md shadow-slate-400 mx-auto py-3'>
                        <MatesList mode='subpage' />
                    </div>

                ) : (
                    <div className='w-full h-fit flex flex-col justify-center px-5 mb-4'>
                        <h2 className='w-full h-fit flex justify-center text-xl mb-4'>Your transactions:</h2>
                        <TransactionsList filterId={user.id} transactions={actionsData && transactions} actionsLoading={actionsLoading} actionsError={actionsError} />
                    </div>
                )}

            </div >
        </>
    )
}