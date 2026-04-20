interface BuildRoomActionsFeedbackParams {
  actionMessage: string;
  actionTone: 'success' | 'error';
  resetActionState: () => void;
}

export const buildRoomActionsFeedback = ({
  actionMessage,
  actionTone,
  resetActionState,
}: BuildRoomActionsFeedbackParams) => ({
  roomActionMessage: actionMessage,
  roomActionMessageTone: actionTone,
  resetActionState,
});
