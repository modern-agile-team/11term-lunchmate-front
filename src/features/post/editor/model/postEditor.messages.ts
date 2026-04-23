import axios from 'axios';

interface PostEditorErrorResult {
  message: string;
  requiresLogin: boolean;
}

export const getPostEditorDialogCopy = (mode: 'create' | 'edit') => ({
  eyebrow: mode === 'edit' ? '게시글 수정' : '게시글 작성',
  title:
    mode === 'edit'
      ? '게시글 내용을 최신 상태로 정리해보세요'
      : '점심 메이트와 이야기를 나눠보세요',
});

export const getPostEditorSubmitLabel = (
  mode: 'create' | 'edit',
  isPending: boolean,
) => {
  if (isPending) {
    return mode === 'edit' ? '수정 중...' : '작성 중...';
  }

  return mode === 'edit' ? '게시글 수정' : '게시글 작성';
};

export const getPostEditorErrorMessage = (
  error: unknown,
  mode: 'create' | 'edit',
): PostEditorErrorResult => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseMessage =
      typeof error.response?.data === 'object' &&
      error.response?.data !== null &&
      'message' in error.response.data &&
      typeof error.response.data.message === 'string'
        ? error.response.data.message
        : '';

    if (status === 401) {
      return {
        message:
          mode === 'edit'
            ? '로그인 후 게시글을 수정할 수 있어요.'
            : '로그인 후 게시글을 작성할 수 있어요.',
        requiresLogin: true,
      };
    }

    if (status === 400) {
      return {
        message: responseMessage || '입력한 내용을 다시 확인해주세요.',
        requiresLogin: false,
      };
    }

    if (status === 403) {
      return { message: '게시글을 수정할 권한이 없어요.', requiresLogin: false };
    }

    if (status === 404) {
      return {
        message:
          mode === 'edit' ? '게시글을 찾을 수 없어요.' : '게시글 카테고리를 찾을 수 없어요.',
        requiresLogin: false,
      };
    }
  }

  return {
    message:
      mode === 'edit'
        ? '게시글을 수정하지 못했어요. 잠시 후 다시 시도해주세요.'
        : '게시글을 작성하지 못했어요. 잠시 후 다시 시도해주세요.',
    requiresLogin: false,
  };
};
