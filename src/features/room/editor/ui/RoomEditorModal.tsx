import AppDialog from '@/shared/ui/modal/AppDialog';
import { useRoomEditorForm } from '../model/useRoomEditorForm';
import { getRoomEditorDialogCopy } from '../model/roomEditor.messages';
import type { RoomEditorModalProps } from '../model/roomEditor.types';
import RoomEditorForm from './RoomEditorForm';

const RoomEditorModal = (props: RoomEditorModalProps) => {
  const { isOpen } = props;
  const roomEditor = useRoomEditorForm(props);
  const dialogCopy = getRoomEditorDialogCopy(roomEditor.isEditMode ? 'edit' : 'create');

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={roomEditor.reset}
      eyebrow={dialogCopy.eyebrow}
      title={dialogCopy.title}
    >
      <RoomEditorForm roomEditor={roomEditor} />
    </AppDialog>
  );
};

export default RoomEditorModal;
