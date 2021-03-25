import { InputType } from '../../../common/enums/input-type';

export interface IChangeMediaStatusActionPayload {
  kind: InputType.VideoInput | InputType.AudioInput;
}
