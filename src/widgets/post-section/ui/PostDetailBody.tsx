import { PostAuthorAvatar, type MainPostDetail } from '@/entities/post';
import { formatPostDetailDate } from '@/shared/lib/date/formatCreatedAt';

interface PostDetailBodyProps {
  selectedPostDetail: MainPostDetail;
}

const PostDetailBody = ({ selectedPostDetail }: PostDetailBodyProps) => (
  <>
    <div className="mt-3 flex items-center gap-2">
      <PostAuthorAvatar
        nickname={selectedPostDetail.authorNickname}
        profileImageUrl={selectedPostDetail.authorProfileImageUrl}
      />
      <p className="text-sm font-medium text-slate-500">{selectedPostDetail.authorNickname}</p>
      <span className="text-sm text-slate-400">
        {formatPostDetailDate(selectedPostDetail.createdAt)}
      </span>
    </div>
    <p className="mt-6 whitespace-pre-wrap text-[15px] leading-7 text-slate-600">
      {selectedPostDetail.content}
    </p>
  </>
);

export default PostDetailBody;
