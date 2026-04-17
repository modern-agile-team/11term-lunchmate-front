interface ProfileImageEditorProps {
  isOpen: boolean;
  imageInputValue: string;
  imageError: boolean;
  onImageInputChange: (value: string) => void;
  onApply: () => void;
  onClose: () => void;
}

const ProfileImageEditor = ({
  isOpen,
  imageInputValue,
  imageError,
  onImageInputChange,
  onApply,
  onClose,
}: ProfileImageEditorProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-full max-w-xs space-y-2">
      <input
        type="url"
        value={imageInputValue}
        onChange={(event) => onImageInputChange(event.target.value)}
        placeholder="이미지 URL을 입력하세요"
        className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onApply}
          className="h-11 flex-1 rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          적용
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          취소
        </button>
      </div>
      {imageError ? (
        <p className="text-xs text-rose-500">
          이미지를 불러오지 못했어요. 다른 URL을 입력하면 다시 시도합니다.
        </p>
      ) : null}
    </div>
  );
};

export default ProfileImageEditor;
