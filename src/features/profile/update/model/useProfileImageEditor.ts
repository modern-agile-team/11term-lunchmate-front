import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState, type ChangeEvent } from 'react';
import { myUserQueryOptions, updateMyUser, uploadMyProfileImage } from '@/entities/user';

export const useProfileImageEditor = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { imageURL } = await uploadMyProfileImage(file);

      return updateMyUser({ profileImageUrl: imageURL });
    },
    onSuccess: (updatedUser) => {
      setImageError(false);
      queryClient.setQueryData(myUserQueryOptions().queryKey, updatedUser);
    },
  });

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    uploadMutation.mutate(file);
  };

  return {
    fileInputRef,
    imageError,
    setImageError,
    isUploadPending: uploadMutation.isPending,
    uploadErrorMessage: uploadMutation.isError
      ? '이미지 업로드에 실패했어요. 다시 시도해 주세요.'
      : '',
    handleImageButtonClick,
    handleImageFileChange,
  };
};
