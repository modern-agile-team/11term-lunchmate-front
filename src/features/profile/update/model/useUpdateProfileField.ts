import { useMutation, useQueryClient } from '@tanstack/react-query';
import { myUserQueryOptions, updateMyUser } from '@/entities/user';

export const useUpdateProfileField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(myUserQueryOptions().queryKey, updatedUser);
    },
  });
};
