import React from 'react';

import { FriendList, AddFriend } from '@components';

import './contacts.scss';

const BLOCK_NAME = 'contacts-page';

export const ContactsPage: React.FC = () => (
  <>
    <FriendList />
    <div className={BLOCK_NAME}>
      <AddFriend />
    </div>
  </>
);
