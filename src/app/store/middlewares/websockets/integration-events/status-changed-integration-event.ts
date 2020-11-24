import { UserStatus } from 'store/friends/models';

export interface StatusChangedIntegrationEvent {
	status: UserStatus;
	userId: number;
}
