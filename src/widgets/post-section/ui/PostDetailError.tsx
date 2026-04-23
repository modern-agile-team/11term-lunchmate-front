interface PostDetailErrorProps {
  error: unknown;
}

const PostDetailError = ({ error }: PostDetailErrorProps) => (
  <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-600">
    게시글 상세를 불러오지 못했어요.
    {error instanceof Error ? ` ${error.message}` : ''}
  </div>
);

export default PostDetailError;
