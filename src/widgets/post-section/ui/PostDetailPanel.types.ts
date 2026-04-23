import type { MainPostDetail } from '@/entities/post';
import type { PostCommentSectionState } from '../comment/model/types';

export interface PostDetailQueryState {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export interface PostDetailPanelDetailState {
  selectedPostDetail: MainPostDetail | null;
  postDetailQuery: PostDetailQueryState;
  canEditSelectedPost: boolean;
}

export interface PostDetailPanelReactionState {
  reactionErrorMessage: string;
  handlePostReaction: (type: 'like' | 'dislike') => Promise<void>;
  isLikePostPending: boolean;
  isDislikePostPending: boolean;
}

export interface PostDetailPanelActionState {
  onEditOpen: () => void;
  onDeleteOpen: () => void;
}

export interface PostDetailPanelProps {
  detail: PostDetailPanelDetailState;
  reactions: PostDetailPanelReactionState;
  actions: PostDetailPanelActionState;
  comments: PostCommentSectionState;
}
