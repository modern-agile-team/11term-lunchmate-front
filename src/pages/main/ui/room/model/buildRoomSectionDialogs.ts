import type { RoomEditorFormValues } from '@/features/room/edit';

interface BuildRoomSectionDialogsParams {
  isEditRoomModalOpen: boolean;
  setIsEditRoomModalOpen: (isOpen: boolean) => void;
  editRoomInitialValues: RoomEditorFormValues | undefined;
  editRoomId: number | undefined;
  handleEditRoomSuccess: () => Promise<void>;
}

export const buildRoomSectionDialogs = ({
  isEditRoomModalOpen,
  setIsEditRoomModalOpen,
  editRoomInitialValues,
  editRoomId,
  handleEditRoomSuccess,
}: BuildRoomSectionDialogsParams) => ({
  isEditRoomModalOpen,
  setIsEditRoomModalOpen,
  editRoomInitialValues,
  editRoomId,
  handleEditRoomSuccess,
});
