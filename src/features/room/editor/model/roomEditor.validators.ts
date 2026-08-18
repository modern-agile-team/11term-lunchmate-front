import { combineKSTDateTimeISOString } from '@/shared/lib/date/formatKST';
import type { RoomEditorFormValues } from './roomEditor.types';

export interface RoomEditorCurrentUser {
  gender: 'MALE' | 'FEMALE';
  age: number;
}

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

export const toValidLunchAt = (dateValue: string, timeValue: string) => {
  const combined = combineKSTDateTimeISOString(dateValue, timeValue);

  if (!combined || new Date(combined).getTime() <= Date.now()) {
    return null;
  }

  return combined;
};

export const validateRoomEditorValues = (
  value: RoomEditorFormValues,
  currentUser: RoomEditorCurrentUser,
): RoomEditorValidationResult => {
  const title = value.title.trim();
  const place = value.place.trim();
  const maxMembersCount = parseRequiredNumber(value.capacity);
  const minAge = parseRequiredNumber(value.minAge);
  const maxAge = parseRequiredNumber(value.maxAge);
  const lunchAt = toValidLunchAt(value.lunchDate, value.lunchTime);

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

  if (value.roomType !== 'MIXED' && value.roomType !== currentUser.gender) {
    return { error: '본인 성별과 맞지 않는 방 조건은 설정할 수 없어요.' };
  }

  if (currentUser.age < minAge || currentUser.age > maxAge) {
    return { error: '본인 나이가 설정한 나이대에 포함되어야 해요.' };
  }

  if (!lunchAt) {
    return { error: '모임 날짜와 시간을 올바르게 입력해 주세요.' };
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
