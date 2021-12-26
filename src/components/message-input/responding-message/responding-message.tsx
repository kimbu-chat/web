import React from 'react';

import classnames from 'classnames';
import { IVoiceAttachment, MessageLinkType } from 'kimbu-models';
import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import { VoiceMessageRespond } from '@components/message-input/responding-message/voice-message';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as ReplySvg } from '@icons/reply.svg';
import { resetReplyToMessageAction } from '@store/chats/actions';
import { getMessageToReplySelector } from '@store/chats/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { getUserSelector } from '@store/users/selectors';
import renderText from '@utils/render-text/render-text';

import './responding-message.scss';

const BLOCK_NAME = 'responding-message';

export const RespondingMessage = () => {
  const replyingMessage = useSelector(getMessageToReplySelector);
  const myId = useSelector(myIdSelector);
  const userCreator = useSelector(getUserSelector(replyingMessage?.userCreatorId));

  const isCurrentUserMessageCreator = replyingMessage?.userCreatorId === myId;

  const resetReplyToMessage = useActionWithDispatch(resetReplyToMessageAction);

  const messageToReply =
    replyingMessage.linkedMessageType === MessageLinkType.Forward
      ? replyingMessage.linkedMessage
      : replyingMessage;

  return (
    <div className={BLOCK_NAME}>
      <ReplySvg className={`${BLOCK_NAME}__icon`} />
      <div className={`${BLOCK_NAME}__line`} />

      <Avatar size={32} user={userCreator} />

      {messageToReply?.text && (
        <div
          className={classnames(
            `${BLOCK_NAME}__message-contents`,
            isCurrentUserMessageCreator
              ? `${BLOCK_NAME}__message-contents--outgoing`
              : `${BLOCK_NAME}__message-contents--incoming`,
          )}>
          {renderText(messageToReply?.text)}
        </div>
      )}
      {messageToReply?.attachments?.some((attachment) => attachment.type === 'Voice') && (
        <div
          className={classnames(
            `${BLOCK_NAME}__message-contents`,
            isCurrentUserMessageCreator
              ? `${BLOCK_NAME}__message-contents--outgoing`
              : `${BLOCK_NAME}__message-contents--incoming`,
          )}>
          <VoiceMessageRespond
            {...(messageToReply?.attachments[0] as IVoiceAttachment)}
            createdByInterlocutor={!isCurrentUserMessageCreator}
          />
        </div>
      )}

      {messageToReply?.attachments?.some((attachment) => attachment.type === 'Picture') && (
        <div
          className={classnames(
            `${BLOCK_NAME}__message-contents`,
            isCurrentUserMessageCreator
              ? `${BLOCK_NAME}__message-contents--outgoing`
              : `${BLOCK_NAME}__message-contents--incoming`,
          )}>
          <VoiceMessageRespond
            {...(messageToReply?.attachments[0] as IVoiceAttachment)}
            createdByInterlocutor={!isCurrentUserMessageCreator}
          />
        </div>
      )}
      <button type="button" onClick={resetReplyToMessage} className={`${BLOCK_NAME}__close`}>
        <CloseSvg />
      </button>
    </div>
  );
};
