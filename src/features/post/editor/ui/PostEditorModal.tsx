import AppDialog from '@/shared/ui/modal/AppDialog';
import { usePostEditorForm } from '../model/usePostEditorForm';
import { getPostEditorDialogCopy } from '../model/postEditor.messages';
import type { PostEditorModalProps } from '../model/postEditor.types';
import PostEditorForm from './PostEditorForm';

const PostEditorModal = ({
  isOpen,
  onClose,
  onRequireLogin,
  onSuccess,
  mode = 'create',
  postId,
  initialValues,
}: PostEditorModalProps) => {
  const postEditor = usePostEditorForm({
    isOpen,
    onClose,
    onRequireLogin,
    onSuccess,
    mode,
    postId,
    initialValues,
  });
  const dialogCopy = getPostEditorDialogCopy(mode);

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={postEditor.reset}
      eyebrow={dialogCopy.eyebrow}
      title={dialogCopy.title}
    >
      <PostEditorForm mode={mode} postEditor={postEditor} />
    </AppDialog>
  );
};

export default PostEditorModal;
