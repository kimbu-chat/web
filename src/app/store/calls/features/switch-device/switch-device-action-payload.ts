import { InputType } from '../../common/enums/input-type';

export interface ISwitchDeviceActionPayload {
  kind: InputType.VideoInput | InputType.AudioInput;
  deviceId: string;
}
