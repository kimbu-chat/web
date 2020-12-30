import { InputType } from '../../common/enums/input-type';

export interface IChangeActiveDeviceIdActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  deviceId: string;
}
