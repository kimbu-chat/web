export interface SwitchDeviceActionPayload {
  kind: 'videoinput' | 'audioinput';
  deviceId: string;
}
