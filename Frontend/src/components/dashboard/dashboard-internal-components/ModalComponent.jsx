export default function ModalComponent({ Component, isOpen, onRequestClose, ...props }) {
    if (!Component) return null;

    return <Component isOpen={isOpen} onRequestClose={onRequestClose} {...props} />
}