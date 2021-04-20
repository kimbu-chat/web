import { useForceUpdate } from '@hooks/use-force-update';
import moment from 'moment';
import React from 'react';

interface ITimeUpdateableProps {
  timeStamp?: Date;
}

const TimeUpdateable: React.FC<ITimeUpdateableProps> = React.memo(({ timeStamp }) => {
  useForceUpdate(30000);

  return <span>{moment.utc(timeStamp).local().startOf('minute').fromNow()}</span>;
});

TimeUpdateable.displayName = 'TimeUpdateable';

export { TimeUpdateable };
