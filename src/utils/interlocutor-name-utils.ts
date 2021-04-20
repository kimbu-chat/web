import { IChat } from '../store/chats/models';
import { IUser } from '../store/common/models';

export const getChatInterlocutor = (chat: IChat): string => {
  const { interlocutor } = chat;

  if (interlocutor) {
    const { firstName, lastName } = interlocutor;

    return `${firstName} ${lastName}`;
  }

  if (chat.groupChat?.name) {
    return chat.groupChat.name;
  }

  return '';
};

export const getInterlocutorInitials = (chat: IChat): string => {
  const initials = getChatInterlocutor(chat)
    .split(' ')
    .reduce((accum, current) => accum + current[0], '');

  return initials.substr(0, 2);
};

export const getUserInitials = (user?: IUser) => {
  if (!user) {
    return '';
  }

  const initials = `${user.firstName} ${user.lastName}`
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
