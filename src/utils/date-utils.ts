export function getDayStart(datetime: number | string | Date) {
  const date = new Date(datetime);
  date.setHours(0, 0, 0, 0);
  return date;
}

export const checkIfDatesAreDifferentDate = (
  startDate: string | Date,
  endDate: string | Date,
): boolean => Number(getDayStart(startDate)) !== Number(getDayStart(endDate));
