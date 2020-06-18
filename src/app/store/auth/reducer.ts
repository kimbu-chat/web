import { AuthActionTypes } from './types';
import { AuthActions } from './actions';

export interface AuthState {
  loading: boolean;
  isLoggedIn: boolean;
  confirmationCode: string;
  isConfirmationCodeWrong: boolean;
}

const initialState: AuthState = {
  loading: false,
  isLoggedIn: false,
  confirmationCode: '',
  isConfirmationCodeWrong: false
};

const auth = (state: AuthState = initialState, action: ReturnType<AuthActions>): AuthState => {
  switch (action.type) {
    case AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE: {
      return {
        ...state,
        loading: true,
        isConfirmationCodeWrong: false
      };
    }
    case AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE_SUCCESS: {
      return {
        ...state,
        loading: false,
        confirmationCode: action.payload
      };
    }
    case AuthActionTypes.CONFIRM_PHONE_FAILURE: {
      return {
        ...state,
        loading: false,
        isConfirmationCodeWrong: true
      };
    }
    default: {
      return state;
    }
  }
};

export default auth;
