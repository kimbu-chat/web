import { UserPreview } from 'app/store/my-profile/models';
import { createAction } from 'typesafe-actions';

export class CreateChat {
  static get action() {
    return createAction('CREATE_DIALOG')<UserPreview>();
  }
}
