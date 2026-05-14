import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteMyUser,
  logout,
  myUserQueryOptions,
  updateMyUser,
  type Gender,
  type UpdateMyUserRequest,
} from '@/entities/user';
import { clearAuthSession } from '@/shared/lib/auth/session';

const EMPTY_FORM: UpdateMyUserRequest = {
  name: '',
  email: '',
  birthDate: '',
  gender: 'ANY',
};

export const useAccountSettings = () => {
  const queryClient = useQueryClient();
  const myUserQuery = useQuery(myUserQueryOptions());
  const [form, setForm] = useState<UpdateMyUserRequest>(EMPTY_FORM);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!myUserQuery.data) {
      return;
    }

    setForm({
      name: myUserQuery.data.name,
      email: myUserQuery.data.email,
      birthDate: myUserQuery.data.birthDate,
      gender: myUserQuery.data.gender,
    });
  }, [myUserQuery.data]);

  const updateMutation = useMutation({
    mutationFn: updateMyUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(myUserQueryOptions().queryKey, updatedUser);
      setMessage('계정 정보가 저장되었어요.');
      setMessageTone('success');
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

  const handleGenderChange = (gender: Gender) => {
    handleFieldChange('gender', gender);
  };

  const handleSave = () => {
    setMessage('');
    updateMutation.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      birthDate: form.birthDate,
      gender: form.gender,
    });
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
    handleGenderChange,
    handleSave,
    handleLogout: () => logoutMutation.mutate(),
    handleDeleteAccount: () => deleteMutation.mutate(),
  };
};
