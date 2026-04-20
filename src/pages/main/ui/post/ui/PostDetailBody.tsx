import type { MainPostDetail } from '@/entities/post';

interface PostDetailBodyProps {
  selectedPostDetail: MainPostDetail;
}

const PostDetailBody = ({ selectedPostDetail }: PostDetailBodyProps) => (
  <>
    <h2 className="mt-5 text-[28px] font-bold tracking-[-0.03em] text-slate-900">
      {selectedPostDetail.title}
    </h2>
    <p className="mt-3 text-sm font-medium text-slate-500">{selectedPostDetail.author}</p>
    <p className="mt-6 whitespace-pre-wrap text-[15px] leading-7 text-slate-600">
      {selectedPostDetail.content}
    </p>
  </>
);

export default PostDetailBody;
