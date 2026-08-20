import { useQuery } from '@tanstack/react-query';
import { postCategoryListQueryOptions } from '@/entities/post';
import { getPostEditorSubmitLabel } from '../model/postEditor.messages';
import type { usePostEditorForm } from '../model/usePostEditorForm';

interface PostEditorFormProps {
  mode: 'create' | 'edit';
  postEditor: ReturnType<typeof usePostEditorForm>;
}

const PostEditorForm = ({ mode, postEditor }: PostEditorFormProps) => {
  const categoriesQuery = useQuery(postCategoryListQueryOptions());
  const categories = categoriesQuery.data ?? [];
  const categoryId = postEditor.postEditorForm.watch('categoryId');
  const isAnonymous = postEditor.postEditorForm.watch('isAnonymous');

  return (
    <form className="mt-6" onSubmit={postEditor.handleSubmit}>
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">카테고리</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = categoryId === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => postEditor.postEditorForm.setValue('categoryId', category.id)}
                  aria-pressed={isSelected}
                  className={`h-9 rounded-2xl border px-4 text-sm font-semibold transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  {category.name}
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

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) =>
              postEditor.postEditorForm.setValue('isAnonymous', event.target.checked)
            }
            className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-300"
          />
          익명으로 작성
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
