import React from 'react';

import { GoogleOAuthProvider } from '@react-oauth/google';

import PhoneConfirmation from './phone-confirmation';

const PhoneConfirmationWrapper: React.FC = () => (
  // todo: move client id to configs
  <GoogleOAuthProvider clientId="1016600291611-v69skii56hvijvuhrg57tnl1djagk150.apps.googleusercontent.com">
    <PhoneConfirmation />
  </GoogleOAuthProvider>
);

export default PhoneConfirmationWrapper;
