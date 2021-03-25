import { FileType } from '../file-type';

export interface IBaseAttachment {
  byteSize: number;
  type: FileType;
  creationDateTime: Date;
  url: string;
  id: number;
}
