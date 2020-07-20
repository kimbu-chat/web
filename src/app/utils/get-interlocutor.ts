import { Dialog } from 'app/store/dialogs/types';
import { UserPreview } from 'app/store/contacts/types';

export const getDialogInterlocutor = (dialog: Dialog): string => {
  const { interlocutor } = dialog;

  if (interlocutor) {
    const { firstName, lastName } = interlocutor;

    const interlocutorName = `${firstName} ${lastName}`;

    return interlocutorName;
  }

  if (dialog.conference?.name) {
    return dialog.conference.name;
  }

  return '';
};

export const getInterlocutorInitials = (dialog: Dialog): string => {
  const initials = getDialogInterlocutor(dialog)
    .split(' ')
    .reduce((accum, current) => {
      return accum + current[0];
    }, '');

  const shortedInitials = initials.substr(0, 2);

  return shortedInitials;
};

export const getUserInitials = (user?: UserPreview | null) => {
  if (!user) {
    return '';
  }

  const initials = `${user.firstName} ${user.lastName}`.split(' ').reduce((accum, current) => {
    return accum + current[0];
  }, '');

  const shortedInitials = initials.substr(0, 2);

  return shortedInitials;
};
