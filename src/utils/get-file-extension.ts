import { FileType } from '../store/chats/models';

export const getFileType = (fileName: string): FileType => {
  const imgRegex = new RegExp(/\.+(jpg|jpeg|gif|tiff|png)$/, 'i');
  const videoRegex = new RegExp(/\.+(mkv|ogv|avi|wmv|asf|mp4|m4p|m4v|mpeg|mpg|mpe|mpv|mpg|m2v)$/, 'i');
  const audioRegex = new RegExp(/\.+(aa|aax|aac|aiff|ape|dsf|flac|m4a|m4b|m4p|mp3|mpc|mpp|ogg|oga|wav|wma|wv|webm)$/, 'i');
  let fileType: FileType = FileType.Raw;

  if (fileName.match(imgRegex)) {
    fileType = FileType.Picture;
  }

  if (fileName.match(videoRegex)) {
    fileType = FileType.Video;
  }

  if (fileName.match(audioRegex)) {
    fileType = FileType.Audio;
  }

  return fileType;
};
