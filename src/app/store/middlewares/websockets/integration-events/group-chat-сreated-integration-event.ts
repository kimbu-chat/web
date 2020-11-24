import { UserPreview } from 'store/my-profile/models';

export interface GroupChatCreatedIntegrationEvent {
	userCreator: UserPreview;
	name: string;
	memberIds: Array<number>;
	systemMessageId: number;
	id: number;
}
