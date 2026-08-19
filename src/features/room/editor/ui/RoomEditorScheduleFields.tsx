import type { RoomEditorFieldComponentProps } from './roomEditorField.types';
import { updateRoomEditorFieldValue } from './updateRoomEditorFieldValue';

const RoomEditorScheduleFields = ({
  roomEditor,
}: RoomEditorFieldComponentProps) => (
  <>
    <roomEditor.roomEditorForm.Field
      name="place"
      children={(field) => (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">모임 장소</span>
          <input
            value={field.state.value}
            onChange={(event) =>
              updateRoomEditorFieldValue(field, roomEditor, event.target.value)
            }
            placeholder="예: 학생식당"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      )}
    />

    <roomEditor.roomEditorForm.Field
      name="lunchDate"
      children={(field) => (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">모임 날짜</span>
          <input
            type="date"
            value={field.state.value}
            disabled={roomEditor.isEditMode}
            onChange={(event) =>
              updateRoomEditorFieldValue(field, roomEditor, event.target.value)
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          {roomEditor.isEditMode ? (
            <span className="text-xs text-slate-400">모임 날짜는 방 생성 후 변경할 수 없어요.</span>
          ) : null}
        </label>
      )}
    />

    <roomEditor.roomEditorForm.Field
      name="lunchTime"
      children={(field) => (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">모임 시간</span>
          <input
            type="time"
            value={field.state.value}
            onChange={(event) =>
              updateRoomEditorFieldValue(field, roomEditor, event.target.value)
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      )}
    />
  </>
);

export default RoomEditorScheduleFields;
