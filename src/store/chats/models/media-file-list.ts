import { IGroupable } from './groupable';

export interface IMediaFileList<TMedia> {
  data: (TMedia & IGroupable)[];
  loading: boolean;
  hasMore: boolean;
}
