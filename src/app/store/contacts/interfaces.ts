import { Page } from '../common/types';

export interface GetLocalContactsActionData {
  page: Page;
  name?: string;
  initializedBySearch: boolean;
}

export interface GetLocalContactsSuccessActionData {
  users: Array<LocalContact>;
  name?: string;
  initializedBySearch?: boolean;
}

export interface UserContactsUpdateRequest {
  phoneNumbers: string[];
  defaultCountry: string;
}

export interface LocalContact {
  isSyncedWithServer?: boolean;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  isRegisteredContact?: boolean;
}
