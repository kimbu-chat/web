import dayjs from 'dayjs';
import React from 'react';

import { useForceUpdate } from '@hooks/use-force-update';

interface ITimeUpdateableProps {
  timeStamp?: Date;
}

const TimeUpdateable: React.FC<ITimeUpdateableProps> = ({ timeStamp }) => {
  useForceUpdate(30000);

  return <span>{dayjs.utc(timeStamp).local().startOf('minute').fromNow()}</span>;
};

TimeUpdateable.displayName = 'TimeUpdateable';

export { TimeUpdateable };
