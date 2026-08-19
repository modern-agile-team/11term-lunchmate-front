import type { RoomEditorFormValues } from '../model/roomEditor.types';
import type { RoomEditorFieldComponentProps } from './roomEditorField.types';
import { updateRoomEditorFieldValue } from './updateRoomEditorFieldValue';

const RoomEditorConditionFields = ({
  roomEditor,
}: RoomEditorFieldComponentProps) => (
  <>
    <roomEditor.roomEditorForm.Field
      name="roomType"
      children={(field) => (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">방 구분</span>
          <select
            value={field.state.value}
            onChange={(event) =>
              updateRoomEditorFieldValue(
                field,
                roomEditor,
                event.target.value as RoomEditorFormValues['roomType'],
              )
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="MIXED">혼성</option>
            <option value="FEMALE">여성</option>
            <option value="MALE">남성</option>
          </select>
        </label>
      )}
    />

    <roomEditor.roomEditorForm.Field
      name="capacity"
      children={(field) => (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">모집 인원</span>
          <input
            type="number"
            min="1"
            value={field.state.value}
            onChange={(event) => updateRoomEditorFieldValue(field, roomEditor, event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      )}
    />

    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">나이대</span>
      <div className="flex items-center gap-2">
        <roomEditor.roomEditorForm.Field
          name="minAge"
          children={(field) => (
            <input
              type="number"
              min="0"
              value={field.state.value}
              onChange={(event) =>
                updateRoomEditorFieldValue(field, roomEditor, event.target.value)
              }
              className="w-full min-w-0 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          )}
        />
        <span className="shrink-0 text-sm text-slate-400">~</span>
        <roomEditor.roomEditorForm.Field
          name="maxAge"
          children={(field) => (
            <input
              type="number"
              min="0"
              value={field.state.value}
              onChange={(event) =>
                updateRoomEditorFieldValue(field, roomEditor, event.target.value)
              }
              className="w-full min-w-0 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          )}
        />
      </div>
    </label>
  </>
);

export default RoomEditorConditionFields;
