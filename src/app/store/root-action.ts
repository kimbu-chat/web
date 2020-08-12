import { ActionUnionType } from './common/actions';
import { AuthActions } from './auth/actions';
import { MessageActions } from './messages/actions';
import { ChatActions } from './dialogs/actions';
import { MyProfileActions } from './my-profile/actions';
import { FriendActions } from './friends/actions';
import { CallActions } from './calls/actions';

export type RootAction =
	| ActionUnionType<typeof MessageActions>
	| ActionUnionType<typeof AuthActions>
	| ActionUnionType<typeof FriendActions>
	| ActionUnionType<typeof ChatActions>
	| ActionUnionType<typeof MyProfileActions>
	| ActionUnionType<typeof CallActions>;
