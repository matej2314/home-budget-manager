import Modal from 'react-modal';


export default function ScreenShotModal({ isOpen, onRequestClose, imageData }) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='w-11/12 h-[25rem] px-2 relative top-20 indirect:top-10 indirectxl:w-8/12 sm:w-8/12 md:w-11/12 md:top-32 lg:w-8/12 lg:top-32 xl:w-[1100px] xl:top-14 xl:h-fit xl:px-6 xl:py-2 bg-black/65 rounded-lg shadow-lg mx-auto xl:translate-y-[2vh] flex flex-col justify-center items-start gap-3'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50'
        >
            <div className='w-full h-full'>
                <button
                    onClick={onRequestClose}
                    type="button"
                    className='absolute top-2 right-2 text-white text-xl font-bold'
                >
                    X
                </button>
                <div className='w-full h-full flex justify-center items-center'>
                    <img
                        src={imageData?.src}
                        className='w-full h-full xl:h-[30rem] object-contain rounded-md shadow-lg flex flex-col items-stretch'
                    >
                    </img>
                </div>

            </div>
        </Modal>
    )
}