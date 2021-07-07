import { CallStatus } from '../../../common/models/call-status';

export interface ICallEndedIntegrationEvent {
  userInterlocutorId: number;
  id: number;
  endDateTime?: string;
  startDateTime: string;
  creationDateTime: string;
  status: CallStatus;
}
