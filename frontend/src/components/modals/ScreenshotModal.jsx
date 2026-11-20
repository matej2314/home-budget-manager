import AppModal from './AppModal';
import { Icon } from '@iconify/react';

export default function ScreenShotModal({ isOpen, onRequestClose, imageData }) {

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Screenshot"
            className="relative w-[92%] max-w-5xl max-h-[90vh] overflow-auto bg-ink rounded-xl shadow-xl p-3 sm:p-4 outline-none"
        >
            <div className="relative w-full">
                <button
                    onClick={onRequestClose}
                    type="button"
                    aria-label="Close"
                    className="absolute top-1 right-1 z-10 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <Icon icon="mdi:close" width={22} height={22} />
                </button>
                <div className="w-full flex justify-center items-center pt-6">
                    <img
                        src={imageData?.src}
                        alt=""
                        className="w-full max-h-[75vh] object-contain rounded-md"
                    />
                </div>
            </div>
        </AppModal>
    )
}
