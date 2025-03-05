import Modal from 'react-modal';

export default function CalendarModal({ selectedEvent, handleCloseModal }) {

    return (
        <Modal
            isOpen={!!selectedEvent}
            onRequestClose={handleCloseModal}
            contentLabel="Transaction details"
            ariaHideApp={false}
            className="relative bg-slate-200 border-2 border-slate-400 w-9/12 md:w-fit py-6 px-14 rounded-md shadow-lg z-999 bg-opacity-100"
            overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
        >
            {selectedEvent && (
                <>
                    <div className='z-999 flex flex-col gap-2'>
                        <h2 className="md:text-xl font-semibold text-center">Transaction details:</h2>
                        <p><strong>Category:</strong> {selectedEvent.details.categoryName}</p>
                        <p><strong>Type:</strong> {selectedEvent.details.type}</p>
                        <p><strong>Value:</strong> {selectedEvent.details.value}</p>
                        <p><strong>User:</strong> {selectedEvent.details.userName}</p>
                        <p><strong>Addition date:</strong> {new Date(selectedEvent.details.addedAt).toLocaleString()}</p>
                    </div>

                    <div className='w-full flex justify-center'>
                        <button
                            onClick={handleCloseModal}
                            className="form-submit-modal-btn"
                        >
                            Cancel
                        </button>
                    </div>

                </>
            )}
        </Modal>
    )
}