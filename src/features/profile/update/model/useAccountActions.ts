import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMyUser, myUserQueryOptions } from '@/entities/user';
import { useLogout } from '@/features/auth/sign-out';
import { clearAuthSession } from '@/shared/lib/auth/session';

export const useAccountActions = () => {
  const queryClient = useQueryClient();
  const { handleLogout, isLogoutPending } = useLogout();

  const deleteMutation = useMutation({
    mutationFn: deleteMyUser,
    onSuccess: async () => {
      clearAuthSession();
      await queryClient.invalidateQueries({ queryKey: myUserQueryOptions().queryKey });
    },
  });

  return {
    handleLogout,
    isLogoutPending,
    isDeletePending: deleteMutation.isPending,
    handleDeleteAccount: () => deleteMutation.mutate(),
  };
};
