import { CallStatus } from '../../../common/models';

export interface ICallEndedIntegrationEvent {
  userInterlocutorId: number;
  id: number;
  duration: number;
  status: CallStatus;
}
