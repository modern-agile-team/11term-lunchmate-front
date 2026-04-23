import RoomEditorBasicFields from './RoomEditorBasicFields';
import RoomEditorConditionFields from './RoomEditorConditionFields';
import RoomEditorScheduleFields from './RoomEditorScheduleFields';
import type { RoomEditorFieldComponentProps } from './roomEditorField.types';

const RoomEditorFields = ({ roomEditor }: RoomEditorFieldComponentProps) => (
  <div className="grid gap-4 md:grid-cols-2">
    <RoomEditorBasicFields roomEditor={roomEditor} />
    <RoomEditorConditionFields roomEditor={roomEditor} />
    <RoomEditorScheduleFields roomEditor={roomEditor} />
  </div>
);

export default RoomEditorFields;
