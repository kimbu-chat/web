import { InputType } from '../../../common/enums/input-type';

export interface IChangeActiveDeviceIdActionPayload {
  kind: InputType.VideoInput | InputType.AudioInput;
  deviceId: string;
}
