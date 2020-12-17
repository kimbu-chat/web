import { InputType } from '../../common/enums/input-type';

export interface SwitchDeviceActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  deviceId: string;
}
