import { IBaseAttachment } from './base-attachment';

export interface IAudioAttachment extends IBaseAttachment {
  title: string;
  duration: number;
}
