import type { ApiErrorPayload } from "@/shared/types/api";
import { isAxiosError } from "axios";


export const getApiMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;
    if (Array.isArray(responseMessage) && responseMessage.length > 0)
      return responseMessage.join(' ');
    if (typeof responseMessage === 'string' && responseMessage.trim() !== '')
      return responseMessage;
  }
  if (error instanceof Error && error.message.trim() !== '') return error.message;
  return fallback;
};
