import { createEmptyAction } from 'app/store/common/actions';

export class Init {
  static get action() {
    return createEmptyAction('INIT');
  }
}
