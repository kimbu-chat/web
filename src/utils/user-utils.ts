import { TFunction } from 'i18next';
import { IChat, IGroupChat } from '../store/chats/models';
import { IUser } from '../store/common/models';

export const getChatInterlocutor = (interlocutor?: IUser, chat?: IChat, t?: TFunction): string => {
  if (interlocutor) {
    if (interlocutor.deleted && t) {
      return t('deleted');
    }

    const { firstName, lastName } = interlocutor;

    return `${firstName} ${lastName}`;
  }

  if (chat?.groupChat?.name) {
    return chat.groupChat.name;
  }

  return '';
};

export const getUserName = (user: IUser, t?: TFunction) => {
  if (user?.deleted && t) {
    return t('deleted');
  }

  return `${user.firstName} ${user.lastName}`;
};

export const getUserInitials = (user?: IUser) => {
  if (!user) {
    return '';
  }

  const initials = getUserName(user)
    .split(' ')
    .reduce((accum, current) => accum + current[0], '');

  return initials.substr(0, 2);
};

export const getStringInitials = (userName?: string) => {
  if (!userName) {
    return '';
  }

  const initials = userName.split(' ').reduce((accum, current) => accum + current[0], '');

  return initials.substr(0, 2);
};

export const getInterlocutorInitials = ({
  user,
  groupChat,
}: {
  user?: IUser;
  groupChat?: IGroupChat;
}): string => {
  if (user) {
    return getUserInitials(user);
  }

  if (groupChat) {
    return getStringInitials(groupChat.name);
  }

  return '';
};
