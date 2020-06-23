import { AuthActionTypes, UserAuthData } from './types';
import { AuthActions } from './actions';
import { AuthService } from 'app/services/auth-service';
import { UserPreview } from '../contacts/types';

export interface AuthState {
  loading: boolean;
  isLoggedIn: boolean;
  confirmationCode: string;
  isConfirmationCodeWrong: boolean;
  isAuthenticated: boolean;
  authentication: UserAuthData;
  currentUser: UserPreview | null;
}

const authService = new AuthService();
const loginReponse = authService.auth;

const initialState: AuthState = {
  loading: false,
  isLoggedIn: false,
  confirmationCode: '',
  isConfirmationCodeWrong: false,
  isAuthenticated: loginReponse ? true : false,
  authentication: loginReponse,
  currentUser: null
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
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        authentication: action.payload
      };
    }
    case AuthActionTypes.GET_MY_PROFILE_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload
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
