import Modal from 'react-modal';

export default function LogOutModal({ isOpen, onRequestClose, handleLogOut }) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className="w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-x-[40vw] translate-y-[30vh] border-2 border-slate-400"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                <h2 className="w-full h-fit flex justify-center text-xl font-bold">Czy na pewno chcesz się wylogować?</h2>
                <div className="w-full h-fit flex justify-center gap-[6rem]">
                    <button
                        className="w-fit h-fit flex justify-center items-center p-3 bg-slate-300 hover:bg-slate-400/35 rounded-xl border-2 border-slate-500/35"
                        onClick={handleLogOut}
                        type="button"
                    >
                        Tak
                    </button>
                    <button
                        onClick={onRequestClose}
                        className="w-fit h-fit flex justify-center items-center p-3 bg-slate-300 hover:bg-slate-400/35 rounded-xl border-2 border-slate-500/35"
                        type="button"
                    >
                        Nie
                    </button>
                </div>
            </div>
        </Modal>
    )
}