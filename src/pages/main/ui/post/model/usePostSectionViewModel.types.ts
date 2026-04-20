import type { RefObject } from 'react';
import type { PostEditorFormValues } from '@/features/post/edit';
import type { MainPostCategoryFilter } from './constants';
import type { MainPostComment, MainPostDetail, MainPostItem, PostSyncRequest } from './types';

export interface PostSectionListState {
  loadMoreRef: RefObject<HTMLDivElement | null>;
  postsQuery: {
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    isFetchingNextPage: boolean;
    hasNextPage?: boolean;
    isFetchNextPageError: boolean;
  };
  postItems: MainPostItem[];
  selectedPostId: number | null;
  onPostSelect: (postId: number) => void;
}

export interface PostSectionDetailState {
  selectedPost: MainPostItem | null | undefined;
  selectedPostDetail: MainPostDetail | null;
  postDetailQuery: {
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    data: MainPostDetail | undefined | unknown;
  };
  canEditSelectedPost: boolean;
  reactionErrorMessage: string;
  handlePostReaction: (type: 'like' | 'dislike') => Promise<void>;
  isLikePostPending: boolean;
  isDislikePostPending: boolean;
}

export interface PostSectionCommentsState {
  commentsQuery: {
    isLoading: boolean;
    isError: boolean;
    error: unknown;
  };
  selectedPostComments: MainPostComment[];
  commentActions: ReturnType<typeof import('./useCommentActions').useCommentActions>;
}

export interface PostSectionDialogsState {
  isEditPostModalOpen: boolean;
  setIsEditPostModalOpen: (isOpen: boolean) => void;
  isDeleteConfirmModalOpen: boolean;
  setIsDeleteConfirmModalOpen: (isOpen: boolean) => void;
  deleteErrorMessage: string;
  handleDeletePost: () => Promise<void>;
  isDeletePostPending: boolean;
  editPostInitialValues: PostEditorFormValues | undefined;
  handleEditPostSuccess: (syncedPost: PostSyncRequest) => void;
}

export interface UsePostSectionViewModelParams {
  selectedCategory: MainPostCategoryFilter;
  setSelectedCategory: (category: MainPostCategoryFilter) => void;
  list: PostSectionListState;
  detail: PostSectionDetailState;
  comments: PostSectionCommentsState;
  dialogs: PostSectionDialogsState;
}
