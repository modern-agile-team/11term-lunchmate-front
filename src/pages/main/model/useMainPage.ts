import { useState } from 'react';
import type { PostSyncRequest } from '../ui/post';
import type { MainTab } from '../ui/layout/main-tabs';

export const useMainPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('ROOM');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postSyncRequest, setPostSyncRequest] = useState<PostSyncRequest | null>(null);

  return {
    isLoginModalOpen,
    setIsLoginModalOpen,
    activeTab,
    setActiveTab,
    isCreateRoomModalOpen,
    setIsCreateRoomModalOpen,
    isCreatePostModalOpen,
    setIsCreatePostModalOpen,
    postSyncRequest,
    setPostSyncRequest,
  };
};
