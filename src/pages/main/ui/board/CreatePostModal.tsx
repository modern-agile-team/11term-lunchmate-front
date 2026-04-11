import axios from 'axios';
import { useEffect, useId, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { createPost, postQueries, type CreatePostResponse } from '@/shared/api/posts';
import {
  boardCategoryIdLabelMap,
  boardCategoryIdMap,
  boardCategoryOptions,
  type MainBoardCategory,
} from './board.constants';
import type { MainBoardCreatedPostSyncRequest } from './types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequireLogin: () => void;
  onSuccess: (createdPost: MainBoardCreatedPostSyncRequest) => void;
}

interface CreatePostFormValues {
  category: MainBoardCategory;
  title: string;
  content: string;
}

const INITIAL_CREATE_POST_FORM_VALUES: CreatePostFormValues = {
  category: 'FREE',
  title: '',
  content: '',
};

const getCreatedPostCategory = (createdPost: CreatePostResponse): MainBoardCategory => {
  if (
    createdPost.category === 'FREE' ||
    createdPost.category === 'REVIEW' ||
    createdPost.category === 'INFO' ||
    createdPost.category === 'TALK'
  ) {
    return createdPost.category;
  }

  if (createdPost.categoryId !== undefined && createdPost.categoryId !== null) {
    return boardCategoryIdLabelMap[createdPost.categoryId] ?? 'FREE';
  }

  return 'FREE';
};

const CreatePostModal = ({
  isOpen,
  onClose,
  onRequireLogin,
  onSuccess,
}: CreatePostModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState('');
  const categoryId = useId();
  const titleId = useId();
  const contentId = useId();
  const createPostForm = useForm<CreatePostFormValues>({
    defaultValues: INITIAL_CREATE_POST_FORM_VALUES,
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
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

  const handleClose = () => {
    createPostForm.reset(INITIAL_CREATE_POST_FORM_VALUES);
    setSubmitError('');
    onClose();
  };

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      handleClose();
    }
  };

  const handleCreatePostSubmit = createPostForm.handleSubmit(async (values) => {
    const trimmedTitle = values.title.trim();
    const trimmedContent = values.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setSubmitError('제목과 본문을 입력해주세요.');
      return;
    }

    setSubmitError('');

    try {
      const createdPost = await createPostMutation.mutateAsync({
        categoryId: boardCategoryIdMap[values.category],
        title: trimmedTitle,
        content: trimmedContent,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postQueries.lists() }),
        queryClient.invalidateQueries({ queryKey: postQueries.details() }),
      ]);

      onSuccess({
        postId: createdPost.id,
        category: getCreatedPostCategory(createdPost),
      });
      handleClose();
    } catch (error) {
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
          setSubmitError('로그인 후 게시글을 작성할 수 있어요.');
          onRequireLogin();
          return;
        }

        if (status === 400) {
          setSubmitError(responseMessage || '입력한 내용을 다시 확인해주세요.');
          return;
        }

        if (status === 404) {
          setSubmitError('게시글 카테고리를 찾을 수 없어요.');
          return;
        }
      }

      setSubmitError('게시글을 작성하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  });

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleDialogClick}
      className="backdrop:bg-slate-950/50 w-full max-w-2xl rounded-[32px] bg-white p-0 text-left shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-500">게시글 작성</p>
            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
              점심 메이트와 이야기를 나눠보세요
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-6" onSubmit={handleCreatePostSubmit}>
          <div className="grid gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">카테고리</span>
              <select
                id={categoryId}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                {...createPostForm.register('category', { required: true })}
              >
                {boardCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">제목</span>
              <input
                id={titleId}
                type="text"
                placeholder="제목을 입력해주세요"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                {...createPostForm.register('title', {
                  required: true,
                  validate: (value) => value.trim().length > 0,
                })}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">본문</span>
              <textarea
                id={contentId}
                rows={8}
                placeholder="게시글 내용을 입력해주세요"
                className="min-h-[220px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                {...createPostForm.register('content', {
                  required: true,
                  validate: (value) => value.trim().length > 0,
                })}
              />
            </label>
          </div>

          {submitError ? (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {submitError}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              닫기
            </button>
            <button
              type="submit"
              disabled={createPostMutation.isPending}
              className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)] transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {createPostMutation.isPending ? '작성 중...' : '게시글 작성'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreatePostModal;
