import type { MainPostComment } from '@/entities/comment';

export type MessageTone = 'success' | 'error';

export interface CommentListViewState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export interface CommentItemState {
  editingCommentId: number | null;
  editingCommentValue: string;
  deletingCommentId: number | null;
  likingCommentId: number | null;
  dislikingCommentId: number | null;
  editMessage: string;
  editTone: MessageTone;
  deleteMessage: string;
  deleteTone: MessageTone;
}

export interface CommentItemActions {
  onEditingChange: (value: string) => void;
  onEditStart: (comment: MainPostComment) => void;
  onEditCancel: () => void;
  onEditSubmit: (comment: MainPostComment) => void;
  onDeleteStart: (commentId: number) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: (comment: MainPostComment) => void;
  onLike: (comment: MainPostComment) => void;
  onDislike: (comment: MainPostComment) => void;
}

export interface CommentComposerState {
  inputValue: string;
  changeInputValue: (value: string) => void;
  submit: () => Promise<void>;
  isPending: boolean;
  message: string;
  tone: MessageTone;
}

export interface CommentEditorState {
  editingCommentId: number | null;
  editingCommentValue: string;
  deletingCommentId: number | null;
  editMessage: string;
  editTone: MessageTone;
  deleteMessage: string;
  deleteTone: MessageTone;
  startEdit: (comment: MainPostComment) => void;
  changeEditValue: (value: string) => void;
  cancelEdit: () => void;
  submitEdit: (comment: MainPostComment) => Promise<void>;
  startDelete: (commentId: number) => void;
  cancelDelete: () => void;
  confirmDelete: (comment: MainPostComment) => Promise<void>;
}

export interface CommentReactionState {
  handleCommentReaction: (
    comment: MainPostComment,
    type: 'like' | 'dislike',
  ) => Promise<void>;
  likingCommentId: number | null;
  dislikingCommentId: number | null;
  commentLikeMessage: string;
  commentLikeTone: MessageTone;
  commentDislikeMessage: string;
  commentDislikeTone: MessageTone;
}

export interface PostCommentSectionState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  comments: MainPostComment[];
  composer: CommentComposerState;
  editor: CommentEditorState;
  reactions: CommentReactionState;
}

export interface PostCommentSectionControllerState {
  sectionState: PostCommentSectionState;
  actions: {
    resetTransientState: () => void;
  };
}
