export const KST_TIME_ZONE = 'Asia/Seoul';

const KST_OFFSET_HOURS = 9;

const kstTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: KST_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const kstDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: KST_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatKSTTime = (isoString: string): string => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return kstTimeFormatter.format(date);
};

/** Returns the KST calendar date of an ISO instant as "YYYY-MM-DD". */
export const formatKSTDate = (isoString: string): string => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return kstDateFormatter.format(date);
};

/** Today's KST calendar date as "YYYY-MM-DD" — for default form values. */
export const getTodayKSTDateString = (): string => kstDateFormatter.format(new Date());

/**
 * Combines a "YYYY-MM-DD" date and "HH:MM" time — both interpreted as KST
 * wall-clock values — into the equivalent ISO instant, independent of the
 * browser's own timezone. Returns null when either input is malformed.
 */
export const combineKSTDateTimeISOString = (
  dateString: string,
  timeString: string,
): string | null => {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeString.trim());

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const [, year, month, day] = dateMatch;
  const [, hour, minute] = timeMatch;

  const date = new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour) - KST_OFFSET_HOURS,
      Number(minute),
      0,
      0,
    ),
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};
