import { createEmptyAction } from '@store/common/actions';

export class KillDeviceUpdateWatcher {
  static get action() {
    return createEmptyAction('KILL_DEVICE_UPDATE_WATCHER');
  }
}
