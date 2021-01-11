import { CallStatus } from 'app/store/models';

export interface ICallEndedIntegrationEvent {
  userInterlocutorId: number;
  id: number;
  duration: number;
  status: CallStatus;
}
