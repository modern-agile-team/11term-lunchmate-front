import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post';
import { createPost } from '../create.api';

export const useCreatePostSubmit = () => {
  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: postQueryKeys.details() }),
      ]);
    },
  });

  return {
    createPostMutation,
    isPending: createPostMutation.isPending,
    submitCreatePost: createPostMutation.mutateAsync,
  };
};
