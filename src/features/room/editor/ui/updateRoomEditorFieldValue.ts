interface RoomEditorField<T> {
  handleChange: (value: T) => void;
}

interface RoomEditorFieldUpdater {
  setSubmitMessage: (message: string) => void;
}

export const updateRoomEditorFieldValue = <T>(
  field: RoomEditorField<T>,
  roomEditor: RoomEditorFieldUpdater,
  value: T,
) => {
  field.handleChange(value);
  roomEditor.setSubmitMessage('');
};
