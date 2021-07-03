import dayjs from 'dayjs';

import { IGroupable } from '@store/chats/models';
import { SECOND_DURATION } from '@utils/constants';

import { doesYearDifferFromCurrent } from './set-separators';

export function getDayStart(datetime: number | string | Date) {
  const date = new Date(datetime);
  date.setHours(0, 0, 0, 0);
  return date;
}

export const checkIfDatesAreDifferentDate = (
  startDate: string | Date,
  endDate: string | Date,
): boolean => Number(getDayStart(startDate)) !== Number(getDayStart(endDate));

export const separateGroupable = <T>(groupableItems: (T & IGroupable)[]) =>
  groupableItems.reduce(
    (accumulator: (T & IGroupable)[][], currentItem, index) => {
      if (index > 0 && currentItem.needToShowDateSeparator) {
        accumulator.push([]);
      }

      accumulator[accumulator.length - 1].push(currentItem);

      return accumulator;
    },
    [[]] as (T & IGroupable)[][],
  );

const MONTH_ONLY = 'MMMM';
const MONTH_YEAR = 'MMMM YYYY';

export const dateByOffset = (date: Date): string => {
  const isDifferFromCurrent = doesYearDifferFromCurrent(date);
  return dayjs(date).format(isDifferFromCurrent ? MONTH_YEAR : MONTH_ONLY);
};

export const getMinutesSeconds = (seconds: number) =>
  dayjs.utc(seconds * SECOND_DURATION).format('mm:ss');
