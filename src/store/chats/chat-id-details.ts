import { InterlocutorType } from './models';

export class ChatIdDetails {
  public readonly id: string;

  public readonly interlocutorId: string;

  public readonly interlocutorType: InterlocutorType;

  public readonly userId: string | null;

  public readonly groupChatId: string | null;

  constructor(
    id: string,
    interlocutorId: string,
    interlocutorType: InterlocutorType,
    userId: string | null,
    groupChatId: string | null,
  ) {
    this.id = id;
    this.interlocutorId = interlocutorId;
    this.interlocutorType = interlocutorType;
    this.userId = userId;
    this.groupChatId = groupChatId;
  }
}
