import type { ChangeEvent, RefObject } from 'react';

interface ProfileImageEditorProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isUploadPending: boolean;
  uploadErrorMessage: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImageEditor = ({
  fileInputRef,
  isUploadPending,
  uploadErrorMessage,
  onFileChange,
}: ProfileImageEditorProps) => (
  <div className="flex flex-col items-center gap-1 sm:items-start">
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onFileChange}
    />
    {isUploadPending ? <p className="text-xs font-medium text-slate-400">업로드 중...</p> : null}
    {uploadErrorMessage ? <p className="text-xs text-rose-500">{uploadErrorMessage}</p> : null}
  </div>
);

export default ProfileImageEditor;
