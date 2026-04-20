import { useEffect, useRef, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import { useRoomEditorForm } from '../model/useRoomEditorForm';
import type { RoomEditorModalProps } from '../model/roomEditor.types';
import RoomEditorForm from './RoomEditorForm';

const RoomEditorModal = (props: RoomEditorModalProps) => {
  const { isOpen } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const roomEditor = useRoomEditorForm(props);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    if (isOpen && !dialogElement.open) {
      dialogElement.showModal();
      return;
    }

    if (!isOpen && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      roomEditor.reset();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={roomEditor.reset}
      onClick={handleDialogClick}
      className="backdrop:bg-slate-950/50 w-full max-w-2xl rounded-[32px] bg-white p-0 text-left shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-500">
              {roomEditor.isEditMode ? '점심 방 수정하기' : '점심 방 만들기'}
            </p>
            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
              {roomEditor.isEditMode ? '현재 방 정보를 수정해보세요' : '함께 점심할 친구를 모집해보세요'}
            </h2>
          </div>

          <button
            type="button"
            onClick={roomEditor.reset}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <RoomEditorForm roomEditor={roomEditor} />
      </div>
    </dialog>
  );
};

export default RoomEditorModal;
