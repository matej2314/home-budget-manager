import Modal from 'react-modal';
import AddUserToHouseForm from '../forms/AddUserToHouseForm';

export default function AddUserToHouseModal({ handleOpen, onRequestClose }) {

    return (
        <Modal
            isOpen={handleOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className="w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-x-[40vw] translate-y-[30vh]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <button onClick={onRequestClose}
                className='relative left-[22.3rem] bottom-6 text-black hover:text-gray-600'
            >X</button>
            <h2 className="w-full h-fit flex justify-center text-2xl mb-7">Invite new user to household</h2>
            <AddUserToHouseForm onClose={onRequestClose} />
            <div className="flex justify-end mt-4">
                <button
                    onClick={onRequestClose}
                    className="bg-gray-300 text-black p-2 rounded-md hover:bg-slate-300 border-[1px] border-slate-500"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    )

}