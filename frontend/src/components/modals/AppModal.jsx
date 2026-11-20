import Modal from 'react-modal';

Modal.setAppElement('#root');

/**
 * Wspólna nakładka react-modal — półprzezroczysty overlay (Tailwind v4: bg-black/50,
 * nie bg-opacity-*). Bez tego treść pod modalem wygląda na „znikniętą”.
 */
export default function AppModal({
    isOpen,
    onRequestClose,
    contentLabel,
    children,
    className = 'modal-panel',
    overlayClassName = 'modal-overlay',
    ...rest
}) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={contentLabel}
            className={className}
            overlayClassName={overlayClassName}
            bodyOpenClassName="ReactModal__Body--open"
            {...rest}
        >
            {children}
        </Modal>
    );
}
