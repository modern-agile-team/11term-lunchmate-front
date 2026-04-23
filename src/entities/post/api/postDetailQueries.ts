import { queryOptions } from '@tanstack/react-query';
import { getPostDetail } from './postDetail';
import { postQueryKeys } from './postQueryKeys';

export const postDetailQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: postQueryKeys.detail(postId),
    queryFn: () => getPostDetail(postId),
  });
