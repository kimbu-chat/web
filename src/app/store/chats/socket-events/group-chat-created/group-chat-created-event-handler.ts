import { IMessage, SystemMessageType, MessageState } from 'app/store/messages/models';
import { RootState } from 'app/store/root-reducer';
import { SetStore } from 'app/store/set-store';
import { MessageUtils } from 'app/utils/message-utils';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';
import { checkChatExists } from 'store/chats/selectors';
import { ChatId } from '../../chat-id';
import { IChat, IChatsState, InterlocutorType } from '../../models';
import { IGroupChatCreatedIntegrationEvent } from './group-chat-сreated-integration-event';

export class GroupChatCreatedEventHandler {
  static get action() {
    return createAction('GroupChatCreated')<IGroupChatCreatedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof GroupChatCreatedEventHandler.action>): SagaIterator {
      const { description, id, memberIds, name, systemMessageId, userCreator, userCreatorId } = action.payload;
      const chatId = ChatId.from(undefined, id).id;

      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        const doesChatExists: boolean = checkChatExists(chatId, draft.chats as IChatsState);

        if (doesChatExists) {
          return draft;
        }

        const audioUnselected = new Audio(messageCameUnselected);
        audioUnselected.play();

        const messageOfCreation: IMessage = {
          systemMessageType: SystemMessageType.GroupChatCreated,
          text: MessageUtils.createSystemMessage({}),
          creationDateTime: new Date(new Date().toUTCString()),
          userCreator,
          state: MessageState.READ,
          chatId,
          id: systemMessageId,
        };

        const newChat: IChat = {
          id: chatId,
          interlocutorType: InterlocutorType.GROUP_CHAT,
          unreadMessagesCount: 1,
          lastMessage: messageOfCreation,
          groupChat: {
            id,
            name,
            description,
            membersCount: memberIds.length,
            userCreatorId,
          },
          isMuted: false,
          photos: {
            hasMore: true,
            loading: false,
            photos: [],
          },
          videos: {
            hasMore: true,
            loading: false,
            videos: [],
          },
          audios: {
            hasMore: true,
            loading: false,
            audios: [],
          },
          files: {
            hasMore: true,
            loading: false,
            files: [],
          },
          recordings: {
            hasMore: true,
            loading: false,
            recordings: [],
          },
          members: {
            hasMore: true,
            loading: false,
            members: [],
            searchMembers: [],
          },
        };

        draft.chats.chats.unshift(newChat);

        draft.messages.messages.push({
          messages: [messageOfCreation],
          hasMoreMessages: true,
          chatId,
        });

        return draft;
      });

      yield put(SetStore.action(nextState as RootState));
    };
  }
}
