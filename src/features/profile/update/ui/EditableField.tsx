import { Check, PencilLine, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import InfoRow from '@/shared/ui/InfoRow';

interface EditableFieldProps<T> {
  label: string;
  value: T;
  displayValue: ReactNode;
  renderEditor: (value: T, onChange: (value: T) => void) => ReactNode;
  onSave: (value: T) => Promise<void>;
  validate?: (value: T) => string | null;
  align?: 'center' | 'start';
  withBorder?: boolean;
}

const EditableField = <T,>({
  label,
  value,
  displayValue,
  renderEditor,
  onSave,
  validate,
  align = 'center',
  withBorder = true,
}: EditableFieldProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<T>(value);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = () => {
    setDraft(value);
    setError('');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    const validationError = validate?.(draft) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onSave(draft);
      setIsEditing(false);
    } catch {
      setError('저장에 실패했어요. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <InfoRow label={label} align={isEditing ? align : 'center'} withBorder={withBorder}>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          {renderEditor(draft, setDraft)}
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              <Check className="h-3.5 w-3.5" />
              {isSaving ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={isSaving}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-70"
            >
              <X className="h-3.5 w-3.5" />
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">{displayValue}</div>
          <button
            type="button"
            onClick={startEdit}
            aria-label={`${label} 수정`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <PencilLine className="h-4 w-4" />
          </button>
        </div>
      )}
    </InfoRow>
  );
};

export default EditableField;
