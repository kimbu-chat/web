import { InputType } from '../../common/enums/input-type';

export interface ChangeActiveDeviceIdActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  deviceId: string;
}
