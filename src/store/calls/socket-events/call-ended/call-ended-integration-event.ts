import { CallStatus } from '../../../common/models';

export interface ICallEndedIntegrationEvent {
  userInterlocutorId: number;
  id: number;
  endDateTime?: Date;
  startDateTime: Date;
  status: CallStatus;
}
