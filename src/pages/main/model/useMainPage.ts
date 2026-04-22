import { useState } from 'react';
import type { PostSyncRequest } from '@/entities/post';
import type { MainTab } from '../ui/layout/main-tabs';

export const useMainPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('ROOM');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postSyncRequest, setPostSyncRequest] = useState<PostSyncRequest | null>(null);

  return {
    dialogs: {
      isLoginModalOpen,
      setIsLoginModalOpen,
      isCreateRoomModalOpen,
      setIsCreateRoomModalOpen,
      isCreatePostModalOpen,
      setIsCreatePostModalOpen,
    },
    tabs: {
      activeTab,
      setActiveTab,
    },
    postSync: {
      postSyncRequest,
      setPostSyncRequest,
    },
  };
};
