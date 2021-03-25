import { InputType } from '../../../common/enums/input-type';

export interface IGotDevicesInfoActionPayload {
  kind: InputType.VideoInput | InputType.AudioInput;
  devices: MediaDeviceInfo[];
}
