export interface BaseIntegrationEvent {
	objectId: number;
	objectType: string;
	creationDateTime: Date;
	eventType: string;
	eventCreationDateTime: Date;
}
