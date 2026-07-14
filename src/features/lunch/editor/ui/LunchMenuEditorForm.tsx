import { getLunchMenuEditorSubmitLabel } from '../model/lunchMenuEditor.messages';
import { LUNCH_MEAL_TYPE_OPTIONS } from '../model/lunchMenuEditor.types';
import type { useLunchMenuEditorForm } from '../model/useLunchMenuEditorForm';

interface LunchMenuEditorFormProps {
  mode: 'create' | 'edit';
  editor: ReturnType<typeof useLunchMenuEditorForm>;
}

const fieldClassName =
  'rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

const LunchMenuEditorForm = ({ mode, editor }: LunchMenuEditorFormProps) => {
  const mealType = editor.form.watch('mealType');

  return (
    <form className="mt-6" onSubmit={editor.handleSubmit}>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">끼니</span>
        <div className="grid grid-cols-3 gap-2">
          {LUNCH_MEAL_TYPE_OPTIONS.map((option) => {
            const isSelected = mealType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => editor.form.setValue('mealType', option.value)}
                aria-pressed={isSelected}
                className={`h-11 rounded-2xl border text-sm font-semibold transition ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="mt-4 flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">메뉴 이름</span>
        <input
          type="text"
          placeholder="예: 불고기 덮밥"
          className={fieldClassName}
          {...editor.form.register('menuName', {
            required: true,
            validate: (value) => value.trim().length > 0,
          })}
        />
      </label>

      <label className="mt-4 flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">학교/식당 정보</span>
        <input
          type="text"
          placeholder="예: 인덕대학교 학생식당"
          className={fieldClassName}
          {...editor.form.register('schoolInfo', {
            required: true,
            validate: (value) => value.trim().length > 0,
          })}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">가격(원)</span>
          <input
            type="number"
            className={fieldClassName}
            {...editor.form.register('price', { valueAsNumber: true, required: true, min: 0 })}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">칼로리(kcal)</span>
          <input
            type="number"
            className={fieldClassName}
            {...editor.form.register('calorie', { valueAsNumber: true, required: true, min: 0 })}
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">구성 (쉼표로 구분)</span>
        <input
          type="text"
          placeholder="예: 공깃밥, 배추김치, 계란국"
          className={fieldClassName}
          {...editor.form.register('componentsText')}
        />
      </label>

      {editor.submitError ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {editor.submitError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
        <button
          type="button"
          onClick={editor.reset}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          닫기
        </button>
        <button
          type="submit"
          disabled={editor.isPending}
          className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)] transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {getLunchMenuEditorSubmitLabel(mode, editor.isPending)}
        </button>
      </div>
    </form>
  );
};

export default LunchMenuEditorForm;