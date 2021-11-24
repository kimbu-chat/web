import React from 'react';

import classNames from 'classnames';
import { CallStatus, IUser, SystemMessageType } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ReactComponent as AddUsersSvg } from '@icons/add-users.svg';
import { ReactComponent as CrayonSvg } from '@icons/crayon.svg';
import { ReactComponent as CreateChatSvg } from '@icons/create-chat.svg';
import { ReactComponent as DeclinedCallSvg } from '@icons/declined-call.svg';
import { ReactComponent as IncomingCallSvg } from '@icons/incoming-call.svg';
import { ReactComponent as LeaveSvg } from '@icons/leave.svg';
import { ReactComponent as MissedCallSvg } from '@icons/missed-call.svg';
import { ReactComponent as OutgoingCallSvg } from '@icons/outgoing-call.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { myIdSelector } from '@store/my-profile/selectors';
import {
  constructSystemMessageText,
  getSystemMessageData,
  ICallMessage,
} from '@utils/message-utils';
import { NoopComponent } from '@utils/noop-component';

import type { INormalizedMessage } from '@store/chats/models';

import './system-message.scss';

interface ISystemMessageProps {
  message: INormalizedMessage;
  userCreator: IUser;
}

const BLOCK_NAME = 'system-message';
const FAILURE_CALL = [CallStatus.Declined, CallStatus.NotAnswered, CallStatus.Interrupted];

type SystemMessageIcon = Exclude<SystemMessageType, SystemMessageType.None>;

enum CallEndedTypes {
  EndedOutgoing = 'EndedOutgoing',
  EndedIncoming = 'EndedIncoming',
}

type SystemMessageCallTypes = CallStatus | CallEndedTypes;

const SYSTEM_MESSAGE_ICON: Record<SystemMessageIcon, typeof AddUsersSvg> = {
  [SystemMessageType.GroupChatMemberAdded]: AddUsersSvg,
  [SystemMessageType.GroupChatMemberRemoved]: LeaveSvg,
  [SystemMessageType.GroupChatCreated]: CreateChatSvg,
  [SystemMessageType.GroupChatNameChanged]: CrayonSvg,
  [SystemMessageType.GroupChatAvatarChanged]: PictureSvg,
  [SystemMessageType.UserCreated]: NoopComponent,
  [SystemMessageType.CallEnded]: NoopComponent,
  [SystemMessageType.GroupChatAvatarRemoved]: NoopComponent,
};

const SYSTEM_MESSAGE_CALL_STATUS_ICON: Record<SystemMessageCallTypes, typeof AddUsersSvg> = {
  [CallEndedTypes.EndedOutgoing]: OutgoingCallSvg,
  [CallEndedTypes.EndedIncoming]: IncomingCallSvg,
  [CallStatus.NotAnswered]: MissedCallSvg,
  [CallStatus.Declined]: DeclinedCallSvg,
  [CallStatus.Interrupted]: DeclinedCallSvg,
  [CallStatus.Negotiating]: NoopComponent,
  [CallStatus.Active]: NoopComponent,
  [CallStatus.Ended]: NoopComponent,
  [CallStatus.Cancelled]: NoopComponent,
};

function getSystemMessageCallType(
  systemMessageType: SystemMessageType,
  isOutgoing: boolean,
  callStatus: CallStatus,
): SystemMessageCallTypes {
  if (systemMessageType === SystemMessageType.CallEnded) {
    return isOutgoing ? CallEndedTypes.EndedOutgoing : CallEndedTypes.EndedIncoming;
  }

  return callStatus;
}

export const SystemMessage: React.FC<ISystemMessageProps> = ({ message, userCreator }) => {
  const systemCallMessage = getSystemMessageData<ICallMessage>(message);
  const myId = useSelector(myIdSelector) as number;
  const { t } = useTranslation();

  const { status: callStatus, userCallerId } = systemCallMessage;
  const isOutgoing = myId === userCallerId;
  const { systemMessageType } = message;
  const isFailureCall = FAILURE_CALL.some((status) => status === callStatus);

  const SystemMessageIcon = SYSTEM_MESSAGE_ICON[systemMessageType as SystemMessageIcon];
  const SystemMessageCallIcon =
    SYSTEM_MESSAGE_CALL_STATUS_ICON[
      getSystemMessageCallType(systemMessageType, isOutgoing, callStatus)
    ];
  const SystemIcon = SystemMessageIcon || SystemMessageCallIcon;

  return (
    <div className={BLOCK_NAME}>
      <div
        className={classNames(`${BLOCK_NAME}__content`, {
          [`${BLOCK_NAME}__content--success-call`]: callStatus === CallStatus.Ended,
          [`${BLOCK_NAME}__content--failure-call`]: isFailureCall,
        })}>
        <SystemIcon className={`${BLOCK_NAME}__icon`} />
        <span>{constructSystemMessageText(message, t, myId, userCreator)}</span>
      </div>
    </div>
  );
};
