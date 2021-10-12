import React, { useCallback } from 'react';

import dayjs from 'dayjs';

import { useForceUpdate } from '@hooks/use-force-update';

interface ITimeUpdateableProps {
  timeStamp?: string;
}

const TimeUpdateable: React.FC<ITimeUpdateableProps> = ({ timeStamp }) => {
  useForceUpdate(30000);

  const getFromNowTime = useCallback(
    (time?: string) => dayjs.utc(time).local().startOf('minute').fromNow(),
    [],
  );

  return <span>{getFromNowTime(timeStamp)}</span>;
};

TimeUpdateable.displayName = 'TimeUpdateable';

export { TimeUpdateable };
