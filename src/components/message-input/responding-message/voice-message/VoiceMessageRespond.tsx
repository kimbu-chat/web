import React from 'react';

import { Recording } from '@components/recording';

export const VoiceMessageRespond: React.FC<React.ComponentProps<typeof Recording>> = (props) => (
  <Recording {...props} />
);
