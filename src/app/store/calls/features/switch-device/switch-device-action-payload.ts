import { InputType } from '../../common/enums/input-type';

export interface ISwitchDeviceActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  deviceId: string;
}
