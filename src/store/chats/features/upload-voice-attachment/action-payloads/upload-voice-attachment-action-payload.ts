export interface IUploadVoiceAttachmentActionPayload {
  file: File;
  waveFormJson?: string;
  duration: number;
  id: number;
  // url: string;
}
