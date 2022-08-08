import {
  IAudioAttachment,
  IPictureAttachment,
  IRawAttachment,
  IVideoAttachment,
  IFileAttachment,
} from 'kimbu-models';

export type INamedAttachment =
  | IAudioAttachment
  | IPictureAttachment
  | IRawAttachment
  | IVideoAttachment
  | IFileAttachment;
