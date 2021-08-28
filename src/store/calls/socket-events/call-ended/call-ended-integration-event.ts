import { CallStatus } from 'kimbu-models';

export interface ICallEndedIntegrationEvent {
  userInterlocutorId: string;
  id: number;
  endDateTime?: string;
  startDateTime: string;
  creationDateTime: string;
  status: CallStatus;
}
