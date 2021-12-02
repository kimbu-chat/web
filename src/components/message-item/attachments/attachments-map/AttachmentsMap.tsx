import React from 'react';

import classnames from 'classnames';

import { MessageAudioAttachment } from '@components/audio-attachment';
import { FileAttachment } from '@components/file-attachment';
import { MediaGrid } from '@components/message-item/attachments/media-grid/media-grid';
import { RecordingAttachment } from '@components/message-item/attachments/recording-attachment/recording-attachment';
import { ObserveFn } from '@hooks/use-intersection-observer';

import type { NormalizeAccumulator } from '@components/message-item/utilities';

import './attachments-map.scss';

interface IAttachmentsMapProps {
  structuredAttachments: NormalizeAccumulator | null;
  isCurrentUserMessageCreator: boolean;
  observeIntersection: ObserveFn;
  className?: string;
}

const BLOCK_NAME = 'attachments-map';

export const AttachmentsMap: React.FC<IAttachmentsMapProps> = ({
  structuredAttachments,
  isCurrentUserMessageCreator,
  observeIntersection,
  className,
}) => {
  if (!structuredAttachments) {
    return null;
  }

  return (
    <div className={classnames(BLOCK_NAME, className)}>
      {structuredAttachments.files.map((file) => (
        <FileAttachment key={file.id} {...file} />
      ))}
      {structuredAttachments.recordings.map((recording) => (
        <RecordingAttachment
          createdByInterlocutor={!isCurrentUserMessageCreator}
          key={recording.clientId || recording.id}
          {...recording}
        />
      ))}
      {structuredAttachments.audios.map((audio) => (
        <MessageAudioAttachment key={audio.id} {...audio} />
      ))}
      {structuredAttachments.media.length > 0 && (
        <MediaGrid observeIntersection={observeIntersection} media={structuredAttachments.media} />
      )}
    </div>
  );
};
