import React, { useCallback, useContext, useState } from 'react';
import './blocked-users.scss';
import { ReactComponent as ArrowSvg } from '@icons/arrow.svg';
import { LocalizationContext } from '@contexts';
import { IUser } from '@store/common/models';
import { InfiniteScrollLoader } from '@components/messenger-page/shared/infinite-scroll/infinite-scroll-loader/infinite-scroll-loader';
import { BlockedUser } from './blocked-user/blocked-user';

const mockedBlockedUsers: IUser[] = [
  ({
    id: 3,
    firstName: 'ANtonio',
    lastName: 'Banderas',
    phoneNumber: '+375445446388',
    nickname: 'sdfs785',
    avatar: {
      id: 45,
      url:
        'https://kimbu-bucket.s3.eu-west-3.amazonaws.com/kimbu-bucket/2021/01/15/c24af8758204472b8e95323e1c22f21b',
      previewUrl:
        'https://kimbu-bucket.s3.eu-west-3.amazonaws.com/kimbu-bucket/2021/01/15/a7427425aaad45c68cc49de89a31d71d',
    },
    lastOnlineTime: '2021-02-07T11:53:48.0043802',
    status: 'Offline',
  } as unknown) as IUser,
  ({
    id: 8,
    firstName: 'Jyme77',
    lastName: 'Fresco',
    phoneNumber: '+375445446331',
    nickname: 'jfresco',
    avatar: {
      id: 54,
      url:
        'https://kimbu-bucket.s3.eu-west-3.amazonaws.com/kimbu-bucket/2021/02/13/3f1e0decbc3a479c88e262c0322d5335',
      previewUrl:
        'https://kimbu-bucket.s3.eu-west-3.amazonaws.com/kimbu-bucket/2021/02/13/12e161b56aa94858895e1d77609d96a7',
    },
    lastOnlineTime: '2021-03-22T18:04:17.9415821',
    status: 'Away',
  } as unknown) as IUser,
  ({
    id: 4,
    firstName: 'Wasya',
    lastName: 'Pupkin**',
    phoneNumber: '+375445446399',
    nickname: 'vvvvvv',
    avatar: null,
    lastOnlineTime: '2021-03-21T19:13:00.5123798',
    status: 'Offline',
  } as unknown) as IUser,
];

export const BlockedUsers = () => {
  const { t } = useContext(LocalizationContext);

  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadBlockedUsers = useCallback(() => {
    if (opened) {
      setOpened(false);
    } else {
      setLoading(true);
      setOpened(true);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [opened, setOpened, setLoading]);

  return (
    <div className="blocked-users">
      <div className="blocked-users__header">
        <span>{t('blockedUsers.title', { count: 2 })}</span>

        <button
          onClick={loadBlockedUsers}
          type="button"
          className={`blocked-users__header__open ${
            opened ? 'blocked-users__header__open--opened' : ''
          }`}>
          <ArrowSvg viewBox="0 0 48 48" />
        </button>
      </div>

      {opened && loading && <InfiniteScrollLoader />}

      {opened && (
        <div className="blocked-users__content">
          {mockedBlockedUsers.map((user) => (
            <BlockedUser key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};
