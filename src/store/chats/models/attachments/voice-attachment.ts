import { IBaseAttachment } from './base-attachment';

export interface IVoiceAttachment extends IBaseAttachment {
  duration: number;
  waveFormJson: string;
}
