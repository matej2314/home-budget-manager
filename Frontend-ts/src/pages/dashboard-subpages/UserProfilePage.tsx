import { useContext, useState, useRef, useEffect, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from '@store/authContext';
import { useTransactionsStore } from '@store/transactionsStore';
import useDocumentTitle from '@hooks/useDocumentTitle';
import { useTranslation } from 'react-i18next';
import CustomAvatarInput from '@components/dashboard/dashboard-internal-components/CustomAvatarInput';
import { serverUrl } from 'url';
import DashboardHeader from '@components/dashboard/dashboardComponents/DashboardHeader';
import FastActions from '@components/dashboard/dashboard-internal-components/FastActionsSection';
import TransactionsList from '@components/dashboard/dashboard-internal-components/TransactionsList';
import MatesList from '@components/dashboard/dashboard-internal-components/MatesList';
import { showInfoToast, showErrorToast } from '@configs/toastify';
import { AuthContextType } from '@models/authTypes';

export default function UserProfilePage() {
    const { actionsLoading, actionsDataError, actionsData, isTransactionsFetched, fetchTransactions } = useTransactionsStore();
    const { user } = useContext(AuthContext) as AuthContextType;
    const [type, setType] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [sended, setSended] = useState<boolean>(false);
    const { t } = useTranslation("pages");
    const avatarFile = useRef<HTMLInputElement>(null);
    useDocumentTitle('Housemate profile');

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions(1);
        };
    }, [isTransactionsFetched]);


    const handleType = (type: string) => {
        setType(() => type);
    };

    const handleOpenModal = () => {
        setType('email');
        setIsModalOpen(true);

    };

    const { mutate: changeAvatar, isPending } = useMutation({
        mutationFn: async (avatarData: FormData) => {
            const response = await fetch(`${serverUrl}/avatars/save`, {
                method: 'POST',
                body: avatarData,
                credentials: 'include',
            });
    
            const data = await response.json();
            if (data.status !== 'success') {
                throw new Error('Failed to upload avatar');
            }
            return data;
        },
        onMutate: () => {
            setSended(false);
        },
        onSuccess: () => {
            showInfoToast(t("userProfile.successMessage"));
            setTimeout(() => {
                window.location.reload();
            }, 600);
        },
        onError: (error: Error | string) => {
            showErrorToast(t("userProfile.failedError"));
            console.error(error);
        },
        onSettled: () => {
            setSended(true);
        }
    });

    const handleChangeAvatar = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (avatarFile.current?.files?.length === 0) {
            showErrorToast(t("userProfile.avatarInputError"));
            return;
        }
    
        const avatarData = new FormData();
        avatarData.append('avatar', avatarFile!.current!.files![0]);
    
        changeAvatar(avatarData as FormData);
    };
    

    const transactions = !actionsDataError && !actionsLoading && Array.isArray(actionsData) ? actionsData : [];

    return (
        <>
            <div id="pagecontent" className="bg-slate-200 w-full h-screen overflow-auto no-scrollbar">
                <DashboardHeader />
                <div id="middle-content" className="w-full flex flex-col gap-5 py-4 px-5">
                    <div id='page-header' className='w-full h-fit flex justify-center items-center gap-7'>
                        <div className='w-28 h-28 flex rounded-full'>
                            <img src={user && `${serverUrl}/avatars/avatar/${user.id}`} className="rounded-full w-full h-full border-2 border-slate-100" />
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
                            className='avatar-form'
                        >
                            <label htmlFor="avatar" className='text-lg font-semibold'>{t("userProfile.avatarLabel")}</label>
                            <CustomAvatarInput ref={avatarFile} />
                            <button
                                type="submit"
                                disabled={sended || isPending}
                                className='w-fit h-fit border-2 border-slate-400 rounded-md p-3 hover:bg-slate-400 hover:text-slate-50'
                            >
                                {t("userProfile.btnSave")}
                            </button>
                        </form>
                    </>
                ) : type === 'mates' ? (
                    <div className='w-8/12 h-fit flex justify-center shadow-md shadow-slate-400 mx-auto py-3'>
                        <MatesList mode='subpage' />
                    </div>

                ) : (
                    <div className='w-full h-fit flex flex-col justify-center px-5 mb-4'>
                        <h2 className='w-full h-fit flex justify-center text-xl mb-4'>{t("userProfile.transactionsTitle")}</h2>
                        <TransactionsList mainSite={false} filterId={user.id} transactions={actionsData && transactions} actionsLoading={actionsLoading} actionsError={actionsDataError} />
                    </div>
                )}

            </div >
        </>
    )
}