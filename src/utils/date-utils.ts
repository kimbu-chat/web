import dayjs from 'dayjs';

import { IGroupable } from '@store/chats/models';
import {
  SHORT_TIME_AM_PM,
  HOUR_MINUTE_SECOND,
  MINUTES_SECONDS,
  SECOND_DURATION,
} from '@utils/constants';

import { doesYearDifferFromCurrent } from './set-separators';

export function getDayStart(datetime: string | Date) {
  let date: Date;

  if (typeof datetime === 'string') {
    date = new Date(datetime);
  } else {
    date = datetime;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

export const checkIfDatesAreDifferentDate = (
  startDate: string | Date = '',
  endDate: string | Date = '',
): boolean => Number(getDayStart(startDate)) !== Number(getDayStart(endDate));

type IAttachmentGroupSeparated<T> = {
  id: string;
  attachments: Array<T & IGroupable>;
};

type ISeparateGroupableParams<T> = {
  groupableItems: (T & IGroupable)[];
  prefix: string;
};

export const separateGroupable = <T>({ groupableItems, prefix }: ISeparateGroupableParams<T>) => {
  let id = 0;
  return groupableItems.reduce<IAttachmentGroupSeparated<T>[]>(
    (accumulator: IAttachmentGroupSeparated<T>[], currentItem, index) => {
      if (!accumulator.length) {
        accumulator.push({
          id: `${prefix}-${(id += 1)}`,
          attachments: [],
        });
      }
      if (index > 0 && currentItem.needToShowDateSeparator) {
        accumulator.push({
          id: `${prefix}-${(id += 1)}`,
          attachments: [],
        });
      }

      accumulator[accumulator.length - 1].attachments.push(currentItem);

      return accumulator;
    },
    [],
  );
};

const MONTH_ONLY = 'MMMM';
const MONTH_YEAR = 'MMMM YYYY';

export const dateByOffset = (date: string): string => {
  const isDifferFromCurrent = doesYearDifferFromCurrent(new Date(date));
  return dayjs(date).format(isDifferFromCurrent ? MONTH_YEAR : MONTH_ONLY);
};

export const getMinutesSeconds = (seconds: number) =>
  dayjs.utc(seconds * SECOND_DURATION).format(MINUTES_SECONDS);
export const getHourMinuteSecond = (duration: number) =>
  dayjs.utc(duration).format(HOUR_MINUTE_SECOND);
export const getShortTimeAmPm = (creationDateTime: string) =>
  dayjs.utc(creationDateTime).local().format(SHORT_TIME_AM_PM);
