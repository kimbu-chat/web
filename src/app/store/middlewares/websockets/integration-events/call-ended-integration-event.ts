import { CallStatus } from '../../../calls/models';

export interface CallEndedIntegrationEvent {
  userInterlocutorId: number;
  status: CallStatus;
}
