import { useForceUpdate } from 'app/hooks/use-force-update';
import moment from 'moment';
import React from 'react';

interface ITimeUpdateableProps {
  timeStamp?: Date;
}

export const TimeUpdateable: React.FC<ITimeUpdateableProps> = ({ timeStamp }) => {
  useForceUpdate(30000);

  return <span>{moment.utc(timeStamp).local().startOf('minute').fromNow()}</span>;
};
