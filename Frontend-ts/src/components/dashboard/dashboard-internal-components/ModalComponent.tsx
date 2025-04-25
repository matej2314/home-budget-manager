import { ComponentType } from "react";

type ReturnedComponentType = {
    isOpen: boolean;
    onRequestClose: () => void;
};

type ModalComponentInput<T> = {
  Component: ComponentType<T & ReturnedComponentType>;
  isOpen: boolean;
  onRequestClose: () => void;
  props?: T | string;
};

export default function ModalComponent<T>({
  Component,
  isOpen,
  onRequestClose,
  props,
}: ModalComponentInput<T>) {
  if (!Component) return null;

  return (
    <Component
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      {...(props as T)}
    />
  );
}
