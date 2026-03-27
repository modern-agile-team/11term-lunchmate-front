import { X } from 'lucide-react';
import { useState } from 'react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateRoomFormState {
  title: string;
  description: string;
  roomType: 'MIXED' | 'FEMALE' | 'MALE';
  capacity: string;
  place: string;
  lunchAt: string;
  minAge: string;
  maxAge: string;
}

const INITIAL_CREATE_ROOM_FORM_STATE: CreateRoomFormState = {
  title: '',
  description: '',
  roomType: 'MIXED',
  capacity: '4',
  place: '',
  lunchAt: '12:00',
  minAge: '20',
  maxAge: '24',
};

const CreateRoomModal = ({ isOpen, onClose }: CreateRoomModalProps) => {
  const [createRoomFormState, setCreateRoomFormState] = useState(INITIAL_CREATE_ROOM_FORM_STATE);

  if (!isOpen) {
    return null;
  }

  const handleFieldChange = (field: keyof CreateRoomFormState, value: string) => {
    setCreateRoomFormState((previousCreateRoomFormState) => ({
      ...previousCreateRoomFormState,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setCreateRoomFormState(INITIAL_CREATE_ROOM_FORM_STATE);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-500">점심 방 만들기</p>
            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
              함께 점심할 친구를 모집해보세요
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">방 제목</span>
            <input
              value={createRoomFormState.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              placeholder="예: 점심 같이 먹어요"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">방 소개</span>
            <textarea
              value={createRoomFormState.description}
              onChange={(event) => handleFieldChange('description', event.target.value)}
              placeholder="모집하고 싶은 분위기나 식당 정보를 적어주세요"
              className="min-h-[120px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">방 구분</span>
            <select
              value={createRoomFormState.roomType}
              onChange={(event) => handleFieldChange('roomType', event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="MIXED">혼성</option>
              <option value="FEMALE">여성</option>
              <option value="MALE">남성</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">모집 인원</span>
            <input
              value={createRoomFormState.capacity}
              onChange={(event) => handleFieldChange('capacity', event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">최소 나이</span>
            <input
              value={createRoomFormState.minAge}
              onChange={(event) => handleFieldChange('minAge', event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">최대 나이</span>
            <input
              value={createRoomFormState.maxAge}
              onChange={(event) => handleFieldChange('maxAge', event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">모임 장소</span>
            <input
              value={createRoomFormState.place}
              onChange={(event) => handleFieldChange('place', event.target.value)}
              placeholder="예: 학생식당"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">모임 시간</span>
            <input
              value={createRoomFormState.lunchAt}
              onChange={(event) => handleFieldChange('lunchAt', event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            닫기
          </button>
          <button
            type="button"
            className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)] transition hover:bg-indigo-600"
          >
            방 만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
