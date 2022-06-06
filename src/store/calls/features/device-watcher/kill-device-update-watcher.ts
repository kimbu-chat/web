import {createAction} from "@reduxjs/toolkit";

export class KillDeviceUpdateWatcher {
  static get action() {
    return createAction('KILL_DEVICE_UPDATE_WATCHER');
  }
}
