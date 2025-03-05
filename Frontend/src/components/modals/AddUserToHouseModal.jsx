import Modal from 'react-modal';
import AddUserToHouseForm from '../forms/AddUserToHouseForm';

export default function AddUserToHouseModal({ isOpen, onRequestClose }) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className='bg-slate-200 rounded-lg p-6 w-11/12 mt-[10rem] sm:w-7/12 md:w-1/2 md:mb-[25rem] lg:mb-[40rem] xl:mb-[13rem] xl:w-1/3 mx-auto  shadow-lg border-4 border-slate-400'
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='relative w-full flex justify-end ml-4'>
                <button onClick={onRequestClose}
                    className='relative bottom-6 text-black hover:text-gray-600'
                >
                    X
                </button>
            </div>
            <h2 className="w-full h-fit flex justify-center text-2xl mb-7">Invite new user to household</h2>
            <AddUserToHouseForm onClose={onRequestClose} />
            <div className="flex justify-end mt-4">
                <button
                    onClick={onRequestClose}
                    className="bg-gray-300 p-2 rounded-xl hover:bg-slate-400 hover:text-slate-50 text-lg border-2 border-slate-500/45"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    )

}