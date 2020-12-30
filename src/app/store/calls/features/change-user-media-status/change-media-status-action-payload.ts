import { InputType } from '../../common/enums/input-type';

export interface IChangeMediaStatusActionPayload {
  kind: InputType.videoInput | InputType.audioInput;
}
