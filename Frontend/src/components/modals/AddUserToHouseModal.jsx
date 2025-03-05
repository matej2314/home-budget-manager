import Modal from 'react-modal';
import AddUserToHouseForm from '../forms/AddUserToHouseForm';

export default function AddUserToHouseModal({ isOpen, onRequestClose }) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className='add-user-to-house-modal'
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='relative w-full flex justify-end ml-4'>
                <button onClick={onRequestClose}
                    className='relative bottom-6 text-black hover:text-gray-600'
                >
                    X
                </button>
            </div>
            <h2 className="w-full h-fit flex justify-center text-lg font-semibold indirectxl:text-2xl mb-7"
            >
                Invite new user to household
            </h2>
            <AddUserToHouseForm onClose={onRequestClose} />
            <div className="flex justify-end mt-4">
                <button
                    onClick={onRequestClose}
                    className="form-submit-modal-btn"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    )

}