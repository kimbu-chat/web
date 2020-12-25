import { MyProfileService } from 'app/services/my-profile-service';
import { ChatActions } from 'app/store/chats/actions';
import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { IEventHandler } from '../event-handler';
import { MemberLeftGroupChatIntegrationEvent } from '../integration-events/member-left-group-chat-integration-event';

export class MemberLeftGroupChatEventHandler implements IEventHandler<MemberLeftGroupChatIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: MemberLeftGroupChatIntegrationEvent): void {
    const profileService = new MyProfileService();
    const currentUserId = profileService.myProfile.id;

    store.dispatch(ChatActions.memberLeftGroupChat({ ...eventData, isCurrentUserEventCreator: currentUserId === eventData.userId }));
  }
}
