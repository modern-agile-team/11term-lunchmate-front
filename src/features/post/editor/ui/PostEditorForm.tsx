import { postCategoryOptions, type MainPostCategory } from '@/entities/post';
import { getPostEditorSubmitLabel } from '../model/postEditor.messages';
import type { usePostEditorForm } from '../model/usePostEditorForm';

interface PostEditorFormProps {
  mode: 'create' | 'edit';
  postEditor: ReturnType<typeof usePostEditorForm>;
}

const CATEGORY_SELECTED_STYLE: Record<MainPostCategory, string> = {
  FREE: 'border-slate-600 bg-slate-600 text-white',
  REVIEW: 'border-amber-500 bg-amber-500 text-white',
  INFO: 'border-sky-500 bg-sky-500 text-white',
  TALK: 'border-violet-500 bg-violet-500 text-white',
};

const PostEditorForm = ({ mode, postEditor }: PostEditorFormProps) => {
  const category = postEditor.postEditorForm.watch('category');

  return (
    <form className="mt-6" onSubmit={postEditor.handleSubmit}>
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">카테고리</span>
          <div className="flex flex-wrap gap-2">
            {postCategoryOptions.map((option) => {
              const isSelected = category === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => postEditor.postEditorForm.setValue('category', option.value)}
                  aria-pressed={isSelected}
                  className={`h-9 rounded-2xl border px-4 text-sm font-semibold transition ${
                    isSelected
                      ? CATEGORY_SELECTED_STYLE[option.value]
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">제목</span>
          <input
            type="text"
            placeholder="제목을 입력해주세요"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            {...postEditor.postEditorForm.register('title', {
              required: true,
              validate: (value) => value.trim().length > 0,
            })}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">본문</span>
          <textarea
            rows={8}
            placeholder="게시글 내용을 입력해주세요"
            className="min-h-[220px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            {...postEditor.postEditorForm.register('content', {
              required: true,
              validate: (value) => value.trim().length > 0,
            })}
          />
        </label>
      </div>

      {postEditor.submitError ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {postEditor.submitError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
        <button
          type="button"
          onClick={postEditor.reset}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          닫기
        </button>
        <button
          type="submit"
          disabled={postEditor.isPending}
          className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)] transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {getPostEditorSubmitLabel(mode, postEditor.isPending)}
        </button>
      </div>
    </form>
  );
};

export default PostEditorForm;
