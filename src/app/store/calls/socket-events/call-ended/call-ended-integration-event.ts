import { CallStatus } from 'app/store/models';

export interface ICallEndedIntegrationEvent {
  userInterlocutorId: number;
  status: CallStatus;
}
