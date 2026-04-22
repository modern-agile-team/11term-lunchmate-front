import { PencilLine, Trash2 } from 'lucide-react';
import { PostCategoryBadge, type MainPostDetail } from '@/entities/post';
import { formatRelativeCreatedAt } from '@/shared/lib/date/formatRelativeCreatedAt';

interface PostDetailHeaderProps {
  selectedPostDetail: MainPostDetail;
  canEditSelectedPost: boolean;
  onEditOpen: () => void;
  onDeleteOpen: () => void;
}

const PostDetailHeader = ({
  selectedPostDetail,
  canEditSelectedPost,
  onEditOpen,
  onDeleteOpen,
}: PostDetailHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <PostCategoryBadge category={selectedPostDetail.category} />
      <span className="text-sm text-slate-400">
        {formatRelativeCreatedAt(selectedPostDetail.createdAt)}
      </span>
    </div>
    {canEditSelectedPost ? (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEditOpen}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <PencilLine className="h-4 w-4" />
          수정
        </button>
        <button
          type="button"
          onClick={onDeleteOpen}
          className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          <Trash2 className="h-4 w-4" />
          삭제
        </button>
      </div>
    ) : null}
  </div>
);

export default PostDetailHeader;
