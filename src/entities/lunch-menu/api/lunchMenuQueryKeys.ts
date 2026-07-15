export const lunchMenuQueryKeys = {
  all: () => ['lunchMenus'] as const,
  lists: () => [...lunchMenuQueryKeys.all(), 'list'] as const,
};