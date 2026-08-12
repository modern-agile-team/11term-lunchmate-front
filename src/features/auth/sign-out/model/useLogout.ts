import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout, myUserQueryOptions } from '@/entities/user';
import { clearAuthSession } from '@/shared/lib/auth/session';

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: async () => {
      clearAuthSession();
      await queryClient.invalidateQueries({ queryKey: myUserQueryOptions().queryKey });
    },
  });

  return {
    handleLogout: () => logoutMutation.mutate(),
    isLogoutPending: logoutMutation.isPending,
  };
};
