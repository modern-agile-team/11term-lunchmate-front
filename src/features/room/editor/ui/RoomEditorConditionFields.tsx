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

    {(['capacity', 'minAge', 'maxAge'] as const).map((name) => (
      <roomEditor.roomEditorForm.Field
        key={name}
        name={name}
        children={(field) => (
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">
              {name === 'capacity'
                ? '모집 인원'
                : name === 'minAge'
                  ? '최소 나이'
                  : '최대 나이'}
            </span>
            <input
              type="number"
              min={name === 'capacity' ? '1' : '0'}
              value={field.state.value}
              onChange={(event) =>
                updateRoomEditorFieldValue(field, roomEditor, event.target.value)
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        )}
      />
    ))}
  </>
);

export default RoomEditorConditionFields;
