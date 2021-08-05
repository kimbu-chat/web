import {
  IAudioAttachment,
  IPictureAttachment,
  IRawAttachment,
  IVideoAttachment,
} from 'kimbu-models';

export type INamedAttachment =
  | IAudioAttachment
  | IPictureAttachment
  | IRawAttachment
  | IVideoAttachment;
