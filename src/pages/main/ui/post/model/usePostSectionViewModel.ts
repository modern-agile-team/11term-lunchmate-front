import { buildPostSectionComments } from './buildPostSectionComments';
import { buildPostSectionDetail } from './buildPostSectionDetail';
import { buildPostSectionDialogs } from './buildPostSectionDialogs';
import { buildPostSectionList } from './buildPostSectionList';
import type { UsePostSectionViewModelParams } from './usePostSectionViewModel.types';

export const usePostSectionViewModel = ({
  selectedCategory,
  setSelectedCategory,
  list,
  detail,
  comments,
  dialogs,
}: UsePostSectionViewModelParams) => ({
  filter: {
    selectedCategory,
    setSelectedCategory,
  },
  list: buildPostSectionList(list),
  detail: buildPostSectionDetail(detail),
  comments: buildPostSectionComments(comments),
  dialogs: buildPostSectionDialogs(dialogs),
});
