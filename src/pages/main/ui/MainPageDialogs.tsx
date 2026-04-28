import type { PostSyncRequest } from '@/entities/post';
import PostEditorModal from '@/features/post/editor';
import RoomEditorModal from '@/features/room/editor';
import AuthDialog from '@/widgets/auth-dialog';
interface MainPageDialogsProps {
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  isCreateRoomModalOpen: boolean;
  setIsCreateRoomModalOpen: (isOpen: boolean) => void;
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (isOpen: boolean) => void;
  setPostSyncRequest: (value: PostSyncRequest | null) => void;
}

const MainPageDialogs = ({
  isLoginModalOpen,
  setIsLoginModalOpen,
  isCreateRoomModalOpen,
  setIsCreateRoomModalOpen,
  isCreatePostModalOpen,
  setIsCreatePostModalOpen,
  setPostSyncRequest,
}: MainPageDialogsProps) => (
  <>
    <AuthDialog isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    <RoomEditorModal
      isOpen={isCreateRoomModalOpen}
      onClose={() => setIsCreateRoomModalOpen(false)}
      onRequireLogin={() => setIsLoginModalOpen(true)}
    />
    <PostEditorModal
      isOpen={isCreatePostModalOpen}
      onClose={() => setIsCreatePostModalOpen(false)}
      onRequireLogin={() => setIsLoginModalOpen(true)}
      onSuccess={(post) => {
        setPostSyncRequest(post);
      }}
    />
  </>
);

export default MainPageDialogs;
