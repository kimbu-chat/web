import { CallStatus } from '../../../calls/models';

export interface CallEndedIntegrationEvent {
  userCallerId: number;
  userCalleeId: number;
  status: CallStatus;
}
