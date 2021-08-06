import { AttachmentType } from 'kimbu-models';

export const getAttachmentType = (fileName: string): AttachmentType => {
  const imgRegex = new RegExp(/\.+(jpg|jpeg|tiff|png)$/, 'i');
  const videoRegex = new RegExp(
    /\.+(mkv|ogv|avi|wmv|asf|mp4|m4p|m4v|mpeg|mpg|mpe|mpv|mpg|m2v)$/,
    'i',
  );
  const audioRegex = new RegExp(
    /\.+(aa|aax|aac|aiff|ape|dsf|flac|m4a|m4b|m4p|mp3|mpc|mpp|ogg|oga|wav|wma|wv|webm)$/,
    'i',
  );
  let fileType: AttachmentType = AttachmentType.Raw;

  if (fileName.match(imgRegex)) {
    fileType = AttachmentType.Picture;
  }

  if (fileName.match(videoRegex)) {
    fileType = AttachmentType.Video;
  }

  if (fileName.match(audioRegex)) {
    fileType = AttachmentType.Audio;
  }

  return fileType;
};
