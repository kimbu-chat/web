import { MyProfileService } from 'app/services/my-profile-service';
import { ChatActions } from 'app/store/chats/actions';
import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { IEventHandler } from '../event-handler';
import { IMemberLeftGroupChatIntegrationEvent } from '../integration-events/member-left-group-chat-integration-event';

export class MemberLeftGroupChatEventHandler implements IEventHandler<IMemberLeftGroupChatIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IMemberLeftGroupChatIntegrationEvent): void {
    const profileService = new MyProfileService();
    const currentUserId = profileService.myProfile.id;

    store.dispatch(ChatActions.memberLeftGroupChat({ ...eventData, isCurrentUserEventCreator: currentUserId === eventData.userId }));
  }
}
