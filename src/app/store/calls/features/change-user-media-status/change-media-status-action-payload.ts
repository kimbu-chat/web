import { InputType } from '../../common/enums/input-type';

export interface ChangeMediaStatusActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
}
