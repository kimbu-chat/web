import { UserPreview } from 'app/store/my-profile/models';

export interface GroupChatCreatedIntegrationEvent {
	userCreator: UserPreview;
	name: string;
	memberIds: Array<number>;
	systemMessageId: number;
	id: number;
}
