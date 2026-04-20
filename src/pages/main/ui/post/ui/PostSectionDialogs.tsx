import PostEditorModal, { type PostEditorFormValues } from '@/features/post/edit';
import DeletePostConfirmModal from '@/features/post/delete';
import type { PostSyncRequest } from '@/entities/post';

interface PostSectionDialogsProps {
  selectedPostId: number;
  isEditPostModalOpen: boolean;
  setIsEditPostModalOpen: (isOpen: boolean) => void;
  isDeleteConfirmModalOpen: boolean;
  setIsDeleteConfirmModalOpen: (isOpen: boolean) => void;
  isDeletePostPending: boolean;
  deleteErrorMessage: string;
  editPostInitialValues?: PostEditorFormValues;
  onRequireLogin: () => void;
  handleEditPostSuccess: (syncedPost: PostSyncRequest) => void;
  handleDeletePost: () => Promise<void>;
}

const PostSectionDialogs = ({
  selectedPostId,
  isEditPostModalOpen,
  setIsEditPostModalOpen,
  isDeleteConfirmModalOpen,
  setIsDeleteConfirmModalOpen,
  isDeletePostPending,
  deleteErrorMessage,
  editPostInitialValues,
  onRequireLogin,
  handleEditPostSuccess,
  handleDeletePost,
}: PostSectionDialogsProps) => (
  <>
    <PostEditorModal
      isOpen={isEditPostModalOpen}
      onClose={() => setIsEditPostModalOpen(false)}
      onRequireLogin={onRequireLogin}
      mode="edit"
      postId={selectedPostId}
      initialValues={editPostInitialValues}
      onSuccess={handleEditPostSuccess}
    />
    <DeletePostConfirmModal
      isOpen={isDeleteConfirmModalOpen}
      isPending={isDeletePostPending}
      errorMessage={deleteErrorMessage}
      onClose={() => setIsDeleteConfirmModalOpen(false)}
      onConfirm={() => {
        void handleDeletePost();
      }}
    />
  </>
);

export default PostSectionDialogs;
