import type { RoomEditorFormValues } from './roomEditor.types';

interface ParsedRoomEditorValues {
  title: string;
  description: string;
  place: string;
  roomType: 'MALE' | 'FEMALE' | 'ANY';
  maxMembersCount: number;
  lunchAt: string;
  minAge: number;
  maxAge: number;
}

type RoomEditorValidationResult =
  | { error: string; parsed?: never }
  | { error: null; parsed: ParsedRoomEditorValues };

export const parseRequiredNumber = (value: string) => {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return null;
  }

  const parsedValue = Number(trimmedValue);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
};

export const toFutureLunchAt = (timeValue: string) => {
  const trimmedValue = timeValue.trim();

  if (!/^\d{2}:\d{2}$/.test(trimmedValue)) {
    return null;
  }

  const [hours, minutes] = trimmedValue.split(':').map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const now = new Date();
  const lunchAt = new Date(now);

  lunchAt.setHours(hours, minutes, 0, 0);

  if (lunchAt.getTime() <= now.getTime()) {
    lunchAt.setDate(lunchAt.getDate() + 1);
  }

  return lunchAt.toISOString();
};

export const validateRoomEditorValues = (
  value: RoomEditorFormValues,
): RoomEditorValidationResult => {
  const title = value.title.trim();
  const place = value.place.trim();
  const maxMembersCount = parseRequiredNumber(value.capacity);
  const minAge = parseRequiredNumber(value.minAge);
  const maxAge = parseRequiredNumber(value.maxAge);
  const lunchAt = toFutureLunchAt(value.lunchAt);

  if (!title) {
    return { error: '방 제목을 입력해 주세요.' };
  }

  if (!place) {
    return { error: '모임 장소를 입력해 주세요.' };
  }

  if (maxMembersCount === null || maxMembersCount <= 0) {
    return { error: '모집 인원은 1명 이상 숫자로 입력해 주세요.' };
  }

  if (minAge === null || minAge < 0 || maxAge === null || maxAge < 0) {
    return { error: '나이는 0 이상 숫자로 입력해 주세요.' };
  }

  if (minAge > maxAge) {
    return { error: '최소 나이는 최대 나이보다 클 수 없어요.' };
  }

  if (!lunchAt) {
    return { error: '모임 시간을 올바르게 입력해 주세요.' };
  }

  return {
    error: null as null,
    parsed: {
      title,
      description: value.description.trim(),
      place,
      roomType: (value.roomType === 'MIXED' ? 'ANY' : value.roomType) as ParsedRoomEditorValues['roomType'],
      maxMembersCount,
      lunchAt,
      minAge,
      maxAge,
    } satisfies ParsedRoomEditorValues,
  };
};
