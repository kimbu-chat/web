export interface GotDevicesInfoActionPayload {
  kind: 'videoinput' | 'audioinput';
  devices: MediaDeviceInfo[];
}
