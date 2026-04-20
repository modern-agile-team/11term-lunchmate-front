import { isAxiosError } from 'axios';
import type { ApiErrorPayload } from '@/shared/types/api';

export const getRoomSubmitErrorMessage = (error: unknown, mode: 'create' | 'edit') => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return responseMessage.join(' ');
    }

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage;
    }

    if (error.response?.status === 401) {
      return mode === 'edit'
        ? '로그인 후 방을 수정할 수 있어요.'
        : '로그인 후 방을 만들 수 있어요.';
    }

    if (mode === 'edit') {
      if (error.response?.status === 403) {
        return '방을 수정할 권한이 없어요.';
      }

      if (error.response?.status === 404) {
        return '방을 찾을 수 없어요.';
      }

      if (error.response?.status === 409) {
        return '수정할 수 없는 상태예요.';
      }
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return mode === 'edit'
    ? '방 수정에 실패했어요. 잠시 후 다시 시도해 주세요.'
    : '방 만들기에 실패했어요. 잠시 후 다시 시도해 주세요.';
};
