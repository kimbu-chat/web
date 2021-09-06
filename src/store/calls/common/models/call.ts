import { CallStatus } from 'kimbu-models';

export interface INormalizedCall {
  id: number;
  userInterlocutorId: string;
  userCallerId: string;
  endDateTime?: string;
  creationDateTime: string;
  startDateTime: string;
  status: CallStatus;
}
