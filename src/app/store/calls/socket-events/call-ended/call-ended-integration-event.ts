import { CallStatus } from 'app/store/common/models';

export interface ICallEndedIntegrationEvent {
  userInterlocutorId: number;
  id: number;
  duration: number;
  status: CallStatus;
}
