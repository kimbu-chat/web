import React, { useState } from 'react';
import './_ChatActions.scss';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { Dialog } from 'app/store/dialogs/types';
import { useSelector } from 'react-redux';

namespace ChatActions {
  export interface Props {
    muteChat: () => void;
    createConference: () => void;
    deleteContact: () => void;
    deleteChat: () => void;
  }
}

const ChatActions = ({ muteChat, createConference, deleteContact, deleteChat }: ChatActions.Props) => {
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;
  const [actionsDisplayed, setActionsDisplayed] = useState<boolean>(false);

  return (
    <React.Fragment>
      <button onClick={() => setActionsDisplayed(!actionsDisplayed)} className="chat-info__func-btn">
        <span>Действия</span>
        <div className="svg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M5.363 12.318a.9.9 0 1 0 1.274 1.272l4.995-5.007a.9.9 0 0 0 0-1.272L6.696 2.364a.9.9 0 1 0-1.274 1.272l4.302 4.311-4.361 4.371z"></path>
          </svg>
        </div>
      </button>
      {actionsDisplayed && (
        <div className="chat-info__actions-list">
          <button onClick={muteChat} className="chat-info__action-btn">
            <div className="svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M3.86 4.58A4.2 4.2 0 0 1 8 1.19a4.2 4.2 0 0 1 4.14 3.39.8.8 0 0 1 .07.23l.45 3.4 1.5 1.5a1.8 1.8 0 0 1-1.27 3.07h-2.6c.02.09.02.17.02.26a2.3 2.3 0 1 1-4.59-.26h-2.6a1.8 1.8 0 0 1-1.27-3.07l1.5-1.5.44-3.4a.8.8 0 0 1 .07-.23zm3.4 8.2A.8.8 0 0 0 8 13.84a.8.8 0 0 0 .76-1.06H7.25zM4.9 8.68a.8.8 0 0 1-.23.47l-1.7 1.69a.2.2 0 0 0 .15.34h9.77a.2.2 0 0 0 .14-.34l-1.7-1.69a.8.8 0 0 1-.22-.46l-.45-3.45a.8.8 0 0 1-.06-.22A2.6 2.6 0 0 0 8 2.8a2.6 2.6 0 0 0-2.59 2.23.8.8 0 0 1-.06.22L4.9 8.69z"
                ></path>
              </svg>
            </div>
            <span className="chat-info__action-nam">
              {selectedDialog.isMuted ? 'Уведомления отключенны' : 'Уведомления включены'}
            </span>
          </button>
          <button onClick={createConference} className="chat-info__action-btn">
            <div className="svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M11.014 2.526a2.453 2.453 0 0 1 2.457 2.447 2.452 2.452 0 0 1-2.457 2.448 2.453 2.453 0 0 1-2.458-2.448 2.453 2.453 0 0 1 2.458-2.447zm0 1.6a.853.853 0 0 0-.858.847c0 .467.383.848.858.848.474 0 .857-.38.857-.848a.852.852 0 0 0-.857-.847zm-6-1.554a2.407 2.407 0 0 1 2.411 2.401 2.408 2.408 0 0 1-2.411 2.402 2.408 2.408 0 0 1-2.412-2.402 2.407 2.407 0 0 1 2.412-2.401zm0 1.6c-.45 0-.812.36-.812.801 0 .441.363.802.812.802.448 0 .811-.36.811-.802a.807.807 0 0 0-.811-.801zm10.232 10.094a1.798 1.798 0 0 1-1.274.528H1.994a1.797 1.797 0 0 1-1.8-1.8v-.31l.001-1.178a.8.8 0 0 1 .07-.326c.596-1.318 2.739-2.4 4.712-2.415 1.04-.008 2.124.296 3.008.781a6.606 6.606 0 0 1 2.992-.781c1.952-.015 4.055 1.066 4.71 2.388a.8.8 0 0 1 .084.35c.002.256.002.858.001 1.49 0 .479-.19.937-.526 1.273zm-1.274-1.072H9.761c.007-.066.011-.133.011-.2.001-.633 0-1.235-.001-1.49a.8.8 0 0 0-.083-.35 2.728 2.728 0 0 0-.31-.482 4.925 4.925 0 0 1 1.611-.307c1.293-.01 2.712.677 3.183 1.36v1.267a.2.2 0 0 1-.2.202zm-5.8-1.468c-.47-.684-1.89-1.37-3.183-1.361-1.316.01-2.768.703-3.194 1.347l-.001.972v.31a.2.2 0 0 0 .2.2h5.978a.2.2 0 0 0 .2-.202v-1.266z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <span className="chat-info__action-nam">Создать груповой чат</span>
          </button>
          <button onClick={deleteContact} className="chat-info__action-btn">
            <div className="svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M8.01 15.318c-4.03 0-7.3-3.27-7.3-7.3 0-4.03 3.27-7.3 7.3-7.3 4.028 0 7.3 3.27 7.3 7.3 0 4.03-3.272 7.3-7.3 7.3zm0-1.6c3.145 0 5.7-2.554 5.7-5.7a5.673 5.673 0 0 0-1.165-3.45L4.56 12.554a5.673 5.673 0 0 0 3.45 1.164zm3.398-10.275a5.672 5.672 0 0 0-3.399-1.125 5.703 5.703 0 0 0-5.7 5.7c0 1.273.418 2.45 1.125 3.399l7.974-7.974z"
                ></path>
              </svg>
            </div>
            <span className="chat-info__action-nam">Удалить контакт</span>
          </button>
          <button onClick={deleteChat} className="chat-info__action-btn">
            <div className="svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M8.01 15.318c-4.03 0-7.3-3.27-7.3-7.3 0-4.03 3.27-7.3 7.3-7.3 4.028 0 7.3 3.27 7.3 7.3 0 4.03-3.272 7.3-7.3 7.3zm0-1.6c3.145 0 5.7-2.554 5.7-5.7a5.673 5.673 0 0 0-1.165-3.45L4.56 12.554a5.673 5.673 0 0 0 3.45 1.164zm3.398-10.275a5.672 5.672 0 0 0-3.399-1.125 5.703 5.703 0 0 0-5.7 5.7c0 1.273.418 2.45 1.125 3.399l7.974-7.974z"
                ></path>
              </svg>
            </div>
            <span className="chat-info__action-nam">Удалить чат</span>
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default ChatActions;
