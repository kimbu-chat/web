import { AppState } from 'app/store';
import { Store } from 'redux';
import { MessageCreatedIntegrationEvent } from '../integration-events/message-created-integration-event';
import { SystemMessageType, Message, MessageState, CreateMessageRequest } from 'app/store/messages/interfaces';
import { InterlocutorType, Dialog } from 'app/store/dialogs/types';
import { DialogService } from 'app/store/dialogs/dialog-service';
import { IEventHandler } from '../event-handler';
import { MessagesActionTypes } from 'app/store/messages/types';

export class MessageCreatedEventHandler implements IEventHandler<MessageCreatedIntegrationEvent> {
  public handle(store: Store<AppState>, eventData: MessageCreatedIntegrationEvent): void {
    const currentUserId = store.getState().auth.authentication.userId;
    const shouldHandleMessageCreation: boolean =
      eventData.userCreatorId !== currentUserId || eventData.systemMessageType !== SystemMessageType.None;
    if (!shouldHandleMessageCreation) {
      return;
    }

    const interlocutorType: InterlocutorType =
      eventData.destinationType === 'Conference' ? InterlocutorType.CONFERENCE : InterlocutorType.USER;

    const dialogId: number = DialogService.getDialogIdentifier(
      interlocutorType === InterlocutorType.USER ? eventData.userCreator.id : null,
      interlocutorType === InterlocutorType.CONFERENCE ? eventData.destinationId : null
    );

    const message: Message = {
      text: eventData.text,
      systemMessageType: eventData.systemMessageType,
      dialogId: dialogId,
      creationDateTime: new Date(new Date().toUTCString()),
      id: eventData.objectId,
      state: MessageState.READ,
      userCreator: eventData.userCreator
    };

    const dialog: Dialog = {
      id: dialogId,
      interlocutor: interlocutorType === InterlocutorType.CONFERENCE ? null : eventData.userCreator,
      interlocutorType: interlocutorType,
      conference: interlocutorType === InterlocutorType.CONFERENCE ? { id: eventData.destinationId } : null,
      lastMessage: message
    };

    if (eventData.systemMessageType === SystemMessageType.ConferenceMemberRemoved) {
      if (eventData.userCreatorId === currentUserId) {
        // if (DialogRepository.getDialogExistence(dialogId)) {
        //   //delete local dialog on another device on the same user
        // }
        return;
      }
    } else if (eventData.systemMessageType === SystemMessageType.ConferenceMemberAdded) {
      // if (!DialogRepository.getDialogExistence(dialogId)) {
      //   const messageContent = Helpers.getSystemMessageContent(eventData.text) as ConfereceMemberAddedSystemMessageContent;
      //   dialog.conference.membersCount = messageContent.conferenceMembersNumber;
      //   dialog.conference.avatarUrl = messageContent.conferenceAvatarUrl;
      //   dialog.conference.name = messageContent.conferenceName;
      //   dialog.lastMessage = message;
      //   DialogRepository.addOrUpdateDialogs([dialog]);
      // }
    }

    const messageCreation: CreateMessageRequest = {
      message: message,
      dialog: dialog,
      currentUser: { id: currentUserId },
      selectedDialogId: store.getState().dialogs.selectedDialogId as number,
      isFromEvent: true
    };

    store.dispatch({
      type: MessagesActionTypes.CREATE_MESSAGE,
      payload: messageCreation
    });
  }
}
