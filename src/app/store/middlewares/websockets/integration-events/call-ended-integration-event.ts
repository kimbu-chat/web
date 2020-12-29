import { CallStatus } from 'store/calls/models';

export interface CallEndedIntegrationEvent {
  userInterlocutorId: number;
  status: CallStatus;
}
