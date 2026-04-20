import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { usePostEditorForm } from '../model/usePostEditorForm';
import type { PostEditorModalProps } from '../model/postEditor.types';
import PostEditorForm from './PostEditorForm';

const PostEditorModal = ({
  isOpen,
  onClose,
  onRequireLogin,
  onSuccess,
  mode = 'create',
  postId,
  initialValues,
}: PostEditorModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const postEditor = usePostEditorForm({
    isOpen,
    onClose,
    onRequireLogin,
    onSuccess,
    mode,
    postId,
    initialValues,
  });

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    if (isOpen && !dialogElement.open) {
      dialogElement.showModal();
      return;
    }

    if (!isOpen && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      postEditor.reset();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={postEditor.reset}
      onClick={handleDialogClick}
      className="backdrop:bg-slate-950/50 w-full max-w-2xl rounded-[32px] bg-white p-0 text-left shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-500">
              {mode === 'edit' ? '게시글 수정' : '게시글 작성'}
            </p>
            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
              {mode === 'edit'
                ? '게시글 내용을 최신 상태로 정리해보세요'
                : '점심 메이트와 이야기를 나눠보세요'}
            </h2>
          </div>

          <button
            type="button"
            onClick={postEditor.reset}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <PostEditorForm mode={mode} postEditor={postEditor} />
      </div>
    </dialog>
  );
};

export default PostEditorModal;
