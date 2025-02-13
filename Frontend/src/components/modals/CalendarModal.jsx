import Modal from 'react-modal';

export default function CalendarModal({ selectedEvent, handleCloseModal }) {

    return (
        <Modal
            isOpen={!!selectedEvent}
            onRequestClose={handleCloseModal}
            contentLabel="Szczegóły transakcji"
            ariaHideApp={false}
            className="modal-content relative bg-slate-200 border-2 border-slate-400 w-fit py-6 px-14 rounded-md shadow-lg z-999 bg-opacity-100"
            overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
        >
            {selectedEvent && (
                <>
                    <div className='z-999 flex flex-col gap-2'>
                        <h2 className="text-xl font-semibold text-center">Szczegóły transakcji:</h2>
                        <p><strong>Kategoria:</strong> {selectedEvent.details.categoryName}</p>
                        <p><strong>Typ:</strong> {selectedEvent.details.type}</p>
                        <p><strong>Wartość:</strong> {selectedEvent.details.value}</p>
                        <p><strong>Użytkownik:</strong> {selectedEvent.details.userName}</p>
                        <p><strong>Data dodania:</strong> {new Date(selectedEvent.details.addedAt).toLocaleString()}</p>
                    </div>

                    <button
                        onClick={handleCloseModal}
                        className="w-fit h-fit flex justify-self-center text-black p-2 rounded-md border-[1px] border-slate-500 hover:bg-gray-400 hover:text-slate-200 mt-4"
                    >
                        Zamknij
                    </button>
                </>
            )}
        </Modal>
    )
}