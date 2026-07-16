import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteMyUser,
  logout,
  myUserQueryOptions,
  updateMyUser,
  type UpdateMyUserRequest,
} from '@/entities/user';
import { clearAuthSession } from '@/shared/lib/auth/session';

const EMPTY_FORM: UpdateMyUserRequest = {
  name: '',
  email: '',
  birthDate: '',
};

interface UseAccountSettingsParams {
  onSaveSuccess?: () => void;
}

export const useAccountSettings = ({ onSaveSuccess }: UseAccountSettingsParams = {}) => {
  const queryClient = useQueryClient();
  const myUserQuery = useQuery(myUserQueryOptions());
  const [form, setForm] = useState<UpdateMyUserRequest>(EMPTY_FORM);
  const [syncedUserId, setSyncedUserId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');

  if (myUserQuery.data && myUserQuery.data.id !== syncedUserId) {
    setSyncedUserId(myUserQuery.data.id);
    setForm({
      name: myUserQuery.data.name,
      email: myUserQuery.data.email,
      birthDate: myUserQuery.data.birthDate,
    });
  }

  const updateMutation = useMutation({
    mutationFn: updateMyUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(myUserQueryOptions().queryKey, updatedUser);
      setMessage('계정 정보가 저장되었어요.');
      setMessageTone('success');
      onSaveSuccess?.();
    },
    onError: () => {
      setMessage('계정 정보를 저장하지 못했어요.');
      setMessageTone('error');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: async () => {
      clearAuthSession();
      await queryClient.invalidateQueries({ queryKey: myUserQueryOptions().queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMyUser,
    onSuccess: async () => {
      clearAuthSession();
      await queryClient.invalidateQueries({ queryKey: myUserQueryOptions().queryKey });
    },
  });

  const handleFieldChange = <K extends keyof UpdateMyUserRequest>(
    field: K,
    value: UpdateMyUserRequest[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setMessage('');
    updateMutation.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      birthDate: form.birthDate,
    });
  };

  const resetForm = () => {
    if (!myUserQuery.data) {
      return;
    }

    setForm({
      name: myUserQuery.data.name,
      email: myUserQuery.data.email,
      birthDate: myUserQuery.data.birthDate,
    });
    setMessage('');
  };

  return {
    user: myUserQuery.data,
    form,
    isLoading: myUserQuery.isLoading,
    isError: myUserQuery.isError,
    error: myUserQuery.error,
    refetch: myUserQuery.refetch,
    message,
    messageTone,
    isSavePending: updateMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    isDeletePending: deleteMutation.isPending,
    handleFieldChange,
    handleSave,
    resetForm,
    handleLogout: () => logoutMutation.mutate(),
    handleDeleteAccount: () => deleteMutation.mutate(),
  };
};
