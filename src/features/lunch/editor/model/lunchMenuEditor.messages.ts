import axios from 'axios';

export const getLunchMenuEditorDialogCopy = (mode: 'create' | 'edit') => ({
  eyebrow: mode === 'edit' ? '학식 메뉴 수정' : '학식 메뉴 추가',
  title:
    mode === 'edit' ? '메뉴 정보를 최신 상태로 정리해보세요' : '새로운 학식 메뉴를 등록해보세요',
});

export const getLunchMenuEditorSubmitLabel = (mode: 'create' | 'edit', isPending: boolean) => {
  if (isPending) {
    return mode === 'edit' ? '수정 중...' : '등록 중...';
  }

  return mode === 'edit' ? '메뉴 수정' : '메뉴 등록';
};

export const getLunchMenuEditorErrorMessage = (error: unknown, mode: 'create' | 'edit') => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401) {
      return '로그인 후 이용할 수 있어요.';
    }

    if (status === 403) {
      return '관리자만 메뉴를 등록/수정할 수 있어요.';
    }

    if (status === 400) {
      return '입력한 내용을 다시 확인해주세요.';
    }

    if (status === 404) {
      return '메뉴를 찾을 수 없어요.';
    }
  }

  return mode === 'edit'
    ? '메뉴를 수정하지 못했어요. 잠시 후 다시 시도해주세요.'
    : '메뉴를 등록하지 못했어요. 잠시 후 다시 시도해주세요.';
};