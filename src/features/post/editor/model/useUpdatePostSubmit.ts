import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post';
import { updatePost } from '../api';

export const useUpdatePostSubmit = () => {
  const queryClient = useQueryClient();
  const updatePostMutation = useMutation({
    mutationFn: ({
      targetPostId,
      payload,
    }: {
      targetPostId: number;
      payload: Parameters<typeof updatePost>[1];
    }) => updatePost(targetPostId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(variables.targetPostId) }),
        queryClient.invalidateQueries({ queryKey: postQueryKeys.details() }),
      ]);
    },
  });

  return {
    updatePostMutation,
    isPending: updatePostMutation.isPending,
    submitUpdatePost: updatePostMutation.mutateAsync,
  };
};
