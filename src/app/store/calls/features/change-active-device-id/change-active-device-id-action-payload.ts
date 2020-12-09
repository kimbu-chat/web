export interface ChangeActiveDeviceIdActionPayload {
  kind: 'videoinput' | 'audioinput';
  deviceId: string;
}
