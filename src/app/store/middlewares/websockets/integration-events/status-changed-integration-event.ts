import { UserStatus } from 'app/store/friends/models';

export interface StatusChangedIntegrationEvent {
	status: UserStatus;
	userId: number;
}
