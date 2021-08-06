import { CallStatus } from 'kimbu-models';

export interface INormalizedCall {
  id: number;
  userInterlocutorId: number;
  userCallerId: number;
  endDateTime?: string;
  creationDateTime: string;
  startDateTime: string;
  status: CallStatus;
}
