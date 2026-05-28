import type { RoomEditorFieldComponentProps } from './roomEditorField.types';
import { updateRoomEditorFieldValue } from './updateRoomEditorFieldValue';

const RoomEditorBasicFields = ({ roomEditor }: RoomEditorFieldComponentProps) => (
  <>
    <roomEditor.roomEditorForm.Field
      name="title"
      children={(field) => (
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">방 제목</span>
          <input
            value={field.state.value}
            onChange={(event) => updateRoomEditorFieldValue(field, roomEditor, event.target.value)}
            placeholder="예: 점심 같이 먹어요"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      )}
    />

    <roomEditor.roomEditorForm.Field
      name="description"
      children={(field) => (
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">방 소개</span>
          <textarea
            value={field.state.value}
            onChange={(event) => updateRoomEditorFieldValue(field, roomEditor, event.target.value)}
            placeholder="모집하고 싶은 분위기나 식당 정보를 적어주세요"
            className="min-h-[120px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      )}
    />
  </>
);

export default RoomEditorBasicFields;
