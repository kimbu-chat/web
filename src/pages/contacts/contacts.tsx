import React from 'react';

import { FriendList } from '@components/friend-list';
import { AddFriend } from '@components/friend-list/add-friend';

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
