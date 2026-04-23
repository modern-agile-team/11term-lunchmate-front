import { getRoomEditorSubmitLabel } from '../model/roomEditor.messages';
import type { useRoomEditorForm } from '../model/useRoomEditorForm';
import RoomEditorFields from './RoomEditorFields';

interface RoomEditorFormProps {
  roomEditor: ReturnType<typeof useRoomEditorForm>;
}

const RoomEditorForm = ({ roomEditor }: RoomEditorFormProps) => (
  <form
    className="mt-6"
    onSubmit={(event) => {
      event.preventDefault();
      void roomEditor.handleSubmit();
    }}
  >
    <RoomEditorFields roomEditor={roomEditor} />

    {roomEditor.submitMessage ? (
      <p
        className={`mt-4 text-sm ${
          roomEditor.submitMessageTone === 'error' ? 'text-rose-500' : 'text-emerald-600'
        }`}
      >
        {roomEditor.submitMessage}
      </p>
    ) : null}

    <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
      <button
        type="button"
        onClick={roomEditor.reset}
        className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        닫기
      </button>
      <button
        type="submit"
        disabled={roomEditor.isPending}
        className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)] transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {getRoomEditorSubmitLabel(roomEditor.isEditMode ? 'edit' : 'create', roomEditor.isPending)}
      </button>
    </div>
  </form>
);

export default RoomEditorForm;
