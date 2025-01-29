import Modal from 'react-modal';
import sendRequest from "../../utils/sendRequest";
import { serverUrl } from '../../url';

export default function DeleteMessageModal({ isOpen, onRequestClose }) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-200 rounded-lg p-6 w-1/3 mx-auto mt-20 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >

        </Modal>
    )
}