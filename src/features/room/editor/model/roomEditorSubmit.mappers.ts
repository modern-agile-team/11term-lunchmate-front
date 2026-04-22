import type { CreateRoomRequest, UpdateRoomRequest } from '@/entities/room';
import type { RoomEditorFormValues } from './roomEditor.types';
import { validateRoomEditorValues } from './roomEditor.validators';

export const getRoomEditorPayload = (value: RoomEditorFormValues) => {
  const validationResult = validateRoomEditorValues(value);

  if (validationResult.error || !validationResult.parsed) {
    return validationResult;
  }

  const parsedValues = validationResult.parsed;
  const payload: CreateRoomRequest & UpdateRoomRequest = {
    title: parsedValues.title,
    description: parsedValues.description || undefined,
    roomType: parsedValues.roomType,
    maxMembersCount: parsedValues.maxMembersCount,
    place: parsedValues.place,
    lunchAt: parsedValues.lunchAt,
    minAge: parsedValues.minAge,
    maxAge: parsedValues.maxAge,
  };

  return {
    error: null as null,
    payload,
  };
};
