import { InputType } from '../../common/enums/input-type';

export interface IGotDevicesInfoActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  devices: MediaDeviceInfo[];
}
