import React from 'react';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { createMessageAction } from '../../../store/messages/actions';
import './_SendMessage.scss';

const SendMessage = () => {
  const sendMessage = useActionWithDeferred(createMessageAction);

  //Потом уберу - нужно чтоб орьентировался
  // export interface CreateMessageRequest extends EntityCreation {
  //   dialog: Dialog;
  //   currentUser: UserPreview;
  //   selectedDialogId: number;
  //   message: Message;
  //   files?: Array<UploadingFileInfo>;
  //   isFromEvent: boolean;
  // }

  const sendMessageToServer = () => sendMessage({});
  return (
    <div className="messenger__send-message">
      <button className="messenger__display-smiles">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M8 .2a7.8 7.8 0 1 1 0 15.6A7.8 7.8 0 0 1 8 .2zm0 1.6a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8zm0 8.83a2.5 2.5 0 0 0 2.31-1.56.8.8 0 0 1 1.49.6 4.1 4.1 0 0 1-7.56.08.8.8 0 0 1 1.47-.63A2.5 2.5 0 0 0 8 10.63zm2-5.69c.54 0 .98.48.98 1.06 0 .59-.44 1.06-.99 1.06-.54 0-.98-.47-.98-1.06 0-.58.44-1.05.98-1.05zM6.97 6c0-.58-.44-1.06-.98-1.06-.55 0-1 .48-1 1.06 0 .58.45 1.06 1 1.06.54 0 .98-.48.98-1.06z"
          ></path>
        </svg>
      </button>
      <form action="none" className="messenger__input-group" onSubmit={sendMessageToServer}>
        <input placeholder="Напишите сообщение..." type="text" className="messenger__input-message" />
        <button className="messenger__send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M2.56 10.26c.07-.55.58-1.04 1.12-1.1L11 8.38c.56-.06.56-.16 0-.22l-7.3-.78c-.55-.06-1.05-.55-1.12-1.1l-.54-4.02c-.15-1.1.52-1.57 1.5-1.04l11.38 6.1c.97.52 1 1.37 0 1.9l-11.38 6.1c-.97.52-1.65.06-1.5-1.04l.54-4.02z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
