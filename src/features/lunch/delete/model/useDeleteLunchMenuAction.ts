import { useMutation, type QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { lunchMenuQueryKeys, type MainLunchMenu } from '@/entities/lunch-menu';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import { deleteLunchMenu } from '../api';

interface UseDeleteLunchMenuActionParams {
  targetMenu: MainLunchMenu | null;
  queryClient: QueryClient;
  selectedLunchMenuId: number | null;
  setSelectedLunchMenuId: (menuId: number | null) => void;
  closeDeleteConfirm: () => void;
}

export const useDeleteLunchMenuAction = ({
  targetMenu,
  queryClient,
  selectedLunchMenuId,
  setSelectedLunchMenuId,
  closeDeleteConfirm,
}: UseDeleteLunchMenuActionParams) => {
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const deleteLunchMenuMutation = useMutation({ mutationFn: deleteLunchMenu });

  const handleDeleteLunchMenu = async () => {
    if (!targetMenu) {
      return;
    }

    try {
      await deleteLunchMenuMutation.mutateAsync(targetMenu.id);

      queryClient.setQueriesData<MainLunchMenu[]>(
        { queryKey: lunchMenuQueryKeys.all() },
        (currentMenus) => currentMenus?.filter((menu) => menu.id !== targetMenu.id),
      );

      if (selectedLunchMenuId === targetMenu.id) {
        setSelectedLunchMenuId(null);
      }

      setDeleteErrorMessage('');
      closeDeleteConfirm();
      await queryClient.invalidateQueries({ queryKey: lunchMenuQueryKeys.all() });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setDeleteErrorMessage('로그인 후 이용할 수 있어요.');
        return;
      }

      if (isAxiosError(error) && error.response?.status === 403) {
        setDeleteErrorMessage('관리자만 메뉴를 삭제할 수 있어요.');
        return;
      }

      setDeleteErrorMessage(getApiMessage(error, '메뉴를 삭제하지 못했어요.'));
    }
  };

  return {
    deleteErrorMessage,
    setDeleteErrorMessage,
    handleDeleteLunchMenu,
    isDeleteLunchMenuPending: deleteLunchMenuMutation.isPending,
  };
};