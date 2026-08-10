import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { login, myProfileQueryOptions, myUserQueryOptions } from '@/entities/user';
import { setAuthTokens } from '@/shared/lib/auth/session';

interface LoginFormValues {
  email: string;
  password: string;
}

interface UseLoginFormParams {
  onSuccess?: () => void;
}

export const useLoginForm = ({ onSuccess }: UseLoginFormParams = {}) => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } });

  const emailField = register('email', {
    required: '이메일을 입력해 주세요.',
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: '이메일 형식이 올바르지 않습니다.',
    },
  });

  const passwordField = register('password', {
    required: '비밀번호를 입력해 주세요.',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setErrorMessage('');
      setAuthTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(myUserQueryOptions().queryKey, data.user);
      queryClient.invalidateQueries({ queryKey: myProfileQueryOptions().queryKey });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      setErrorMessage(
        isAxiosError(error) && error.response?.status === 401
          ? '이메일 또는 비밀번호가 틀렸습니다.'
          : '로그인 중 오류가 발생했습니다.',
      );
    },
  });

  const onSubmit = handleSubmit((values) => {
    setErrorMessage('');
    mutate({ email: values.email.trim(), password: values.password });
  });

  return {
    emailField,
    passwordField,
    errors,
    isPending,
    errorMessage,
    onSubmit,
  };
};
