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
    setImageInputValue: imageEditor.setImageInputValue,
    setImageError: imageEditor.setImageError,
  });

  return {
    profile: draft.profile,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    imageInputValue: imageEditor.imageInputValue,
    isImageEditorOpen: imageEditor.isImageEditorOpen,
    imageError: imageEditor.imageError,
    saveMessage: save.saveMessage,
    saveMessageTone: save.saveMessageTone,
    isSavePending: save.isSavePending,
    setImageInputValue: imageEditor.setImageInputValue,
    setImageError: imageEditor.setImageError,
    handleFieldChange: draft.handleFieldChange,
    handleImageApply: imageEditor.handleImageApply,
    handleImageEditorToggle: imageEditor.handleImageEditorToggle,
    handleImageEditorClose: imageEditor.handleImageEditorClose,
    handleSave: save.handleSave,
  };
};
