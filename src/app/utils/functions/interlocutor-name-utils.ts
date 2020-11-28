import { Chat } from 'store/chats/models';
import { UserPreview } from 'store/my-profile/models';

export const getChatInterlocutor = (chat: Chat): string => {
  const { interlocutor } = chat;

  if (interlocutor) {
    const { firstName, lastName } = interlocutor;

    const interlocutorName = `${firstName} ${lastName}`;

    return interlocutorName;
  }

  if (chat.groupChat?.name) {
    return chat.groupChat.name;
  }

  return '';
};

export const getInterlocutorInitials = (chat: Chat): string => {
  const initials = getChatInterlocutor(chat)
    .split(' ')
    .reduce((accum, current) => accum + current[0], '');

  const shortedInitials = initials.substr(0, 2);

  return shortedInitials;
};

export const getUserInitials = (user?: UserPreview) => {
  if (!user) {
    return '';
  }

  const initials = `${user.firstName} ${user.lastName}`.split(' ').reduce((accum, current) => accum + current[0], '');

  const shortedInitials = initials.substr(0, 2);

  return shortedInitials;
};

export const getStringInitials = (userName?: string) => {
  if (!userName) {
    return '';
  }

  const initials = userName.split(' ').reduce((accum, current) => accum + current[0], '');

  const shortedInitials = initials.substr(0, 2);

  return shortedInitials;
};
