export const KST_TIME_ZONE = 'Asia/Seoul';

const KST_OFFSET_HOURS = 9;

const kstTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: KST_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const kstPartsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: KST_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

interface KSTDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const getKSTParts = (date: Date): KSTDateParts => {
  const lookup = Object.fromEntries(
    kstPartsFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
  };
};

const kstPartsToUTCDate = ({ year, month, day, hour, minute }: KSTDateParts): Date =>
  new Date(Date.UTC(year, month - 1, day, hour - KST_OFFSET_HOURS, minute, 0, 0));

export const formatKSTTime = (isoString: string): string => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return kstTimeFormatter.format(date);
};

/**
 * Interprets `hours:minutes` as a KST wall-clock time and returns the ISO
 * string for its next occurrence (today if still ahead of now, otherwise
 * tomorrow) — independent of the browser's own timezone.
 */
export const nextKSTDateTimeISOString = (hours: number, minutes: number): string => {
  const now = new Date();
  const nowKSTParts = getKSTParts(now);

  const todayTarget = kstPartsToUTCDate({ ...nowKSTParts, hour: hours, minute: minutes });

  if (todayTarget.getTime() > now.getTime()) {
    return todayTarget.toISOString();
  }

  return kstPartsToUTCDate({
    ...nowKSTParts,
    day: nowKSTParts.day + 1,
    hour: hours,
    minute: minutes,
  }).toISOString();
};
