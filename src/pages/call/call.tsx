import React from 'react';

import { useSelector } from 'react-redux';

import { ActiveCall } from '@components/active-call';
import { IncomingCall } from '@components/incoming-call';
import { amICalledSelector as isCallingMe, amICallingSelector, doIhaveCallSelector } from '@store/calls/selectors';

const Call: React.FC = () => {
  const amICalledSelector = useSelector(isCallingMe);
  const amICallingSelectorSomebody = useSelector(amICallingSelector);
  const amISpeaking = useSelector(doIhaveCallSelector);

  return (
    <>
      {amICalledSelector && <IncomingCall />}
      {(amISpeaking || amICallingSelectorSomebody) && <ActiveCall />}
    </>
  );
};

Call.displayName = 'Call';

export default Call;
