import { PostCategoryBadge, type MainPostDetail } from '@/entities/post';

interface PostDetailHeaderProps {
  selectedPostDetail: MainPostDetail;
}

const PostDetailHeader = ({ selectedPostDetail }: PostDetailHeaderProps) => (
  <PostCategoryBadge category={selectedPostDetail.category} />
);

export default PostDetailHeader;
