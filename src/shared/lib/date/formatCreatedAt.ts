const formatDatePart = (date: Date) =>
  date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatTimePart = (date: Date) =>
  date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const getRelativeTime = (date: Date) => {
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 0 || diffMinutes >= 24 * 60) {
    return null;
  }

  if (diffMinutes < 60) {
    return `${Math.max(1, diffMinutes)}분 전`;
  }

  return `${Math.floor(diffMinutes / 60)}시간 전`;
};

export const formatPostListDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return getRelativeTime(date) ?? formatDatePart(date);
};

export const formatPostDetailDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const relativeTime = getRelativeTime(date);

  if (relativeTime) {
    return relativeTime;
  }

  return `${formatDatePart(date)} ${formatTimePart(date)}`;
};
