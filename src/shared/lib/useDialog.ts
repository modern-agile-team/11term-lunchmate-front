import { useEffect, useRef } from 'react';

interface UseDialogParams {
  isOpen: boolean;
  onClose: () => void;
}

export const useDialog = ({ isOpen, onClose }: UseDialogParams) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    if (isOpen && !dialogElement.open) {
      dialogElement.showModal();
    }

    if (!isOpen && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialogElement.addEventListener('cancel', handleCancel);

    return () => {
      dialogElement.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  return dialogRef;
};
