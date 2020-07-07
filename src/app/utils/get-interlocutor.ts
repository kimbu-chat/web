import { Dialog } from 'app/store/dialogs/types';

export const getDialogInterlocutor = (dialog: Dialog): string => {
  const { interlocutor } = dialog;

  if (interlocutor) {
    const { firstName, lastName } = interlocutor;

    const interlocutorName = `${firstName} ${lastName}`;

    return interlocutorName;
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
