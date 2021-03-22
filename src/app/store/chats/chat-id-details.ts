import { InterlocutorType } from './models';

export class ChatIdDetails {
  public readonly id: number;

  public readonly interlocutorId: number;

  public readonly interlocutorType: InterlocutorType;

  public readonly userId: number | null;

  public readonly groupChatId: number | null;

  constructor(id: number, interlocutorId: number, interlocutorType: InterlocutorType, userId: number | null, groupChatId: number | null) {
    this.id = id;
    this.interlocutorId = interlocutorId;
    this.interlocutorType = interlocutorType;
    this.userId = userId;
    this.groupChatId = groupChatId;
  }
}
