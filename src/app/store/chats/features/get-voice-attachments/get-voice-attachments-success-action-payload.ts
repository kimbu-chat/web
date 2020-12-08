import { VoiceRecordingList } from '../../models';

export interface GetVoiceAttachmentsSuccessActionPayload extends VoiceRecordingList {
  chatId: number;
}
