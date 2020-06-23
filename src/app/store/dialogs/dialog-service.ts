import { InterlocutorType, Dialog, ParsedInterlocutorId } from './types';

export class DialogService {
  public static getDialogIdentifier(userId?: number | null, conferenceId?: number | null): number {
    if (userId) {
      return +`${userId}${InterlocutorType.USER}`;
    }
    return +`${conferenceId}${InterlocutorType.CONFERENCE}`;
  }

  public static getDialogId(interlocutorId: number, conferenceId: number): number {
    if (interlocutorId) {
      return +`${interlocutorId}${InterlocutorType.USER}`;
    }
    return +`${conferenceId}${InterlocutorType.CONFERENCE}`;
  }

  public static parseDialogId(dialogId: number): ParsedInterlocutorId {
    const interlocutorId = +dialogId.toString().substring(0, dialogId.toString().length - 1);
    return {
      interlocutorId,
      // last digit stores interlocutor type
      interlocutorType: dialogId % 10
    };
  }

  public static getInterlocutorType(dialog: Dialog): InterlocutorType {
    if (Boolean(dialog.interlocutor)) {
      return InterlocutorType.USER;
    }
    return InterlocutorType.CONFERENCE;
  }
}
