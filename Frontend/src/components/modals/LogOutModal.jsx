import Modal from 'react-modal';

export default function LogOutModal({ isOpen, onRequestClose, handleLogOut }) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className="w-9/12 xl:w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-y-1/2 mx-auto border-2 border-slate-400"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                <h2 className="w-full h-fit flex justify-center text-xl font-bold">Czy na pewno chcesz się wylogować?</h2>
                <div className="w-full h-fit flex flex-row justify-center gap-14 md:gap-[6rem]">
                    <button
                        className="form-submit-modal-btn"
                        onClick={handleLogOut}
                        type="button"
                    >
                        Tak
                    </button>
                    <button
                        onClick={onRequestClose}
                        className="form-submit-modal-btn"
                        type="button"
                    >
                        Nie
                    </button>
                </div>
            </div>
        </Modal>
    )
}