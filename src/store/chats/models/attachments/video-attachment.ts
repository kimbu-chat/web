import { IBaseAttachment } from './base-attachment';

export interface IVideoAttachment extends IBaseAttachment {
  duration: number;
  firstFrameUrl: string;
  name: string;
}
