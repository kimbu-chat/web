import { CallStatus } from 'store/calls/models';

export interface ICallEndedIntegrationEvent {
  userInterlocutorId: number;
  status: CallStatus;
}
