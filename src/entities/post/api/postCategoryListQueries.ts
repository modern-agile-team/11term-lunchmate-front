import { queryOptions } from '@tanstack/react-query';
import { getPostCategories } from './postCategoryList';
import { postQueryKeys } from './postQueryKeys';

export const postCategoryListQueryOptions = () =>
  queryOptions({
    queryKey: postQueryKeys.categories(),
    queryFn: getPostCategories,
  });
