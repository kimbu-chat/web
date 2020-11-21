import { SystemMessageType } from 'app/store/messages/models';
import { UserPreview } from 'app/store/my-profile/models';

export interface MessageCreatedIntegrationEvent {
	destinationId: number;
	id: number;
	text: string;
	userCreator: UserPreview;
	destinationType: string;
	systemMessageType: SystemMessageType;
	attachments: Array<number>;
	userCreatorId: number;
}
