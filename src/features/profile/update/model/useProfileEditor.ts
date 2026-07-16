import { useQuery } from '@tanstack/react-query';
import { myProfileQueryOptions } from '@/entities/user';
import { useProfileDraft } from './useProfileDraft';
import { useProfileImageEditor } from './useProfileImageEditor';
import { useProfileSave } from './useProfileSave';

export const useProfileEditor = () => {
  const profileQuery = useQuery(myProfileQueryOptions());
  const draft = useProfileDraft({
    profileData: profileQuery.data,
  });
  const imageEditor = useProfileImageEditor({
    profile: draft.profile,
    setProfileDraft: draft.setProfileDraft,
  });
  const save = useProfileSave({
    profile: draft.profile,
    setProfileDraft: draft.setProfileDraft,
    setImageError: imageEditor.setImageError,
  });

  return {
    profile: draft.profile,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    imageError: imageEditor.imageError,
    fileInputRef: imageEditor.fileInputRef,
    isUploadPending: imageEditor.isUploadPending,
    uploadErrorMessage: imageEditor.uploadErrorMessage,
    saveMessage: save.saveMessage,
    saveMessageTone: save.saveMessageTone,
    isSavePending: save.isSavePending,
    setImageError: imageEditor.setImageError,
    handleFieldChange: draft.handleFieldChange,
    handleImageButtonClick: imageEditor.handleImageButtonClick,
    handleImageFileChange: imageEditor.handleImageFileChange,
    handleSave: save.handleSave,
  };
};
