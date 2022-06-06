import { createAction } from "@reduxjs/toolkit";

export class BlockUserSuccess {
  static get action() {
    return createAction<number>('BLOCK_USER_SUCCESS');
  }
}
