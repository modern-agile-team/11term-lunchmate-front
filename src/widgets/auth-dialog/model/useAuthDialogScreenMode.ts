import { useState } from 'react';

export const useAuthDialogScreenMode = () => {
  const [screenMode, setScreenMode] = useState<'login' | 'signup'>('login');

  const resetScreenMode = () => {
    setScreenMode('login');
  };

  return {
    screenMode,
    setScreenMode,
    resetScreenMode,
  };
};
