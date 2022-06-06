import { createAction } from "@reduxjs/toolkit";

export class DismissToAddContactSuccess {
  static get action() {
    return createAction<number>('DISMISS_TO_ADD_CONTACT_SUCCESS');
  }
}
