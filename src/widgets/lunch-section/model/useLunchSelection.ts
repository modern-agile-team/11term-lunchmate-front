import { useMemo, useState } from 'react';
import type { MainLunchMenu } from './types';

interface UseLunchSelectionParams {
  lunchMenus: MainLunchMenu[];
}

export const useLunchSelection = ({ lunchMenus }: UseLunchSelectionParams) => {
  const initialSelectedLunchMenuId = lunchMenus[0]?.id ?? null;
  const [selectedLunchMenuId, setSelectedLunchMenuId] = useState<number | null>(
    initialSelectedLunchMenuId,
  );
  const selectedLunchMenu = useMemo(
    () => lunchMenus.find((lunchMenu) => lunchMenu.id === selectedLunchMenuId) ?? null,
    [lunchMenus, selectedLunchMenuId],
  );

  return {
    selectedLunchMenuId,
    setSelectedLunchMenuId,
    selectedLunchMenu,
  };
};
