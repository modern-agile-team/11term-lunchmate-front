import { PencilLine, Trash2 } from 'lucide-react';
import { PostAuthorAvatar, type MainPostDetail } from '@/entities/post';
import { formatPostDetailDate } from '@/shared/lib/date/formatCreatedAt';

interface PostDetailBodyProps {
  selectedPostDetail: MainPostDetail;
  canEditSelectedPost: boolean;
  onEditOpen: () => void;
  onDeleteOpen: () => void;
}

const PostDetailBody = ({
  selectedPostDetail,
  canEditSelectedPost,
  onEditOpen,
  onDeleteOpen,
}: PostDetailBodyProps) => (
  <>
    <div className="mt-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <PostAuthorAvatar
          nickname={selectedPostDetail.authorNickname}
          profileImageUrl={selectedPostDetail.authorProfileImageUrl}
        />
        <p className="text-sm font-medium text-slate-500">{selectedPostDetail.authorNickname}</p>
        <span className="text-sm text-slate-400">
          {formatPostDetailDate(selectedPostDetail.createdAt)}
        </span>
      </div>
      {canEditSelectedPost ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEditOpen}
            aria-label="게시글 수정"
            title="게시글 수정"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <PencilLine className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDeleteOpen}
            aria-label="게시글 삭제"
            title="게시글 삭제"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
    <p className="mt-6 whitespace-pre-wrap text-[15px] leading-7 text-slate-600">
      {selectedPostDetail.content}
    </p>
  </>
);

export default PostDetailBody;
