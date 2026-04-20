import axios from 'axios';

export const getPostEditorErrorMessage = (
  error: unknown,
  mode: 'create' | 'edit',
) => {
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
      return mode === 'edit'
        ? '로그인 후 게시글을 수정할 수 있어요.'
        : '로그인 후 게시글을 작성할 수 있어요.';
    }

    if (status === 400) {
      return responseMessage || '입력한 내용을 다시 확인해주세요.';
    }

    if (status === 403) {
      return '게시글을 수정할 권한이 없어요.';
    }

    if (status === 404) {
      return mode === 'edit' ? '게시글을 찾을 수 없어요.' : '게시글 카테고리를 찾을 수 없어요.';
    }
  }

  return mode === 'edit'
    ? '게시글을 수정하지 못했어요. 잠시 후 다시 시도해주세요.'
    : '게시글을 작성하지 못했어요. 잠시 후 다시 시도해주세요.';
};
