import { getPostEditorErrorMessage } from './postEditor.messages';
import { toPostEditorPayload, toPostSyncRequest } from './postEditor.mappers';
import type { PostEditorFormValues, PostEditorModalProps } from './postEditor.types';
import { useCreatePostSubmit } from './useCreatePostSubmit';
import { useUpdatePostSubmit } from './useUpdatePostSubmit';

type UsePostEditorSubmitParams = Pick<
  PostEditorModalProps,
  'mode' | 'postId' | 'onRequireLogin' | 'onSuccess'
>;

interface SubmitPostValues {
  category: PostEditorFormValues['category'];
  title: string;
  content: string;
}

export const usePostEditorSubmit = ({
  mode = 'create',
  postId,
  onRequireLogin,
  onSuccess,
}: UsePostEditorSubmitParams) => {
  const createSubmit = useCreatePostSubmit();
  const updateSubmit = useUpdatePostSubmit();

  const submitPost = async (values: SubmitPostValues) => {
    try {
      const payload = toPostEditorPayload(values);
      const syncedPost =
        mode === 'edit'
          ? await (() => {
              if (!postId) {
                throw new Error('게시글 id가 없어요.');
              }

              return updateSubmit.submitUpdatePost({
                targetPostId: postId,
                payload,
              });
            })()
          : await createSubmit.submitCreatePost(payload);

      onSuccess(toPostSyncRequest(syncedPost, values.category));

      return null;
    } catch (error) {
      const errorResult = getPostEditorErrorMessage(error, mode);

      if (errorResult.requiresLogin) {
        onRequireLogin();
      }

      return errorResult.message;
    }
  };

  return {
    isPending: createSubmit.isPending || updateSubmit.isPending,
    submitPost,
  };
};
