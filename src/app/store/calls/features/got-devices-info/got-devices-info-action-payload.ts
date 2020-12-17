import { InputType } from '../../common/enums/input-type';

export interface GotDevicesInfoActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
  devices: MediaDeviceInfo[];
}
