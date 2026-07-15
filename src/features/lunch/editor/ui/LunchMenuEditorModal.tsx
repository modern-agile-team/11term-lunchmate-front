import AppDialog from '@/shared/ui/modal/AppDialog';
import { getLunchMenuEditorDialogCopy } from '../model/lunchMenuEditor.messages';
import type { LunchMenuEditorModalProps } from '../model/lunchMenuEditor.types';
import { useLunchMenuEditorForm } from '../model/useLunchMenuEditorForm';
import LunchMenuEditorForm from './LunchMenuEditorForm';

const LunchMenuEditorModal = ({
  isOpen,
  onClose,
  mode = 'create',
  menuId,
  initialValues,
}: LunchMenuEditorModalProps) => {
  const editor = useLunchMenuEditorForm({
    isOpen,
    onClose,
    mode,
    menuId,
    initialValues,
  });
  const dialogCopy = getLunchMenuEditorDialogCopy(mode);

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={editor.reset}
      eyebrow={dialogCopy.eyebrow}
      title={dialogCopy.title}
    >
      <LunchMenuEditorForm mode={mode} editor={editor} />
    </AppDialog>
  );
};

export default LunchMenuEditorModal;