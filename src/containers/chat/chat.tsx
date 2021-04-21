import React, { useEffect } from 'react';
import { Route } from 'react-router';
import './chat.scss';
import {
  FriendList,
  CallList,
  RoutingChats,
  ActiveCall,
  IncomingCall,
  ChatInfoRightPanel,
  CreateMessageInput,
  ChatList,
  ChatTopBar,
  MessageList,
  NotContact,
  BlockedMessageInput,
  AddFriend,
  AddCall,
  SettingsNavigation,
} from '@components/messenger-page';
import { InternetError } from '@components/shared';
import { useSelector } from 'react-redux';
import {
  amICalledSelector as isCallingMe,
  amICallingSelector,
  doIhaveCallSelector,
} from '@store/calls/selectors';
import { CSSTransition } from 'react-transition-group';
import {
  amIBlackListedByInterlocutorSelector,
  getIsInfoOpenedSelector,
  isCurrentChatBlackListedSelector,
  isCurrentChatDismissedAddToContactsSelector,
  isCurrentChatContactSelector,
  isCurrentChatUserDeactivatedSelector,
} from '@store/chats/selectors';
import { getInternetStateSelector } from '@store/internet/selectors';
import { EditProfile } from '@components/messenger-page/settings-modal/edit-profile/edit-profile';
import { LanguageSettings } from '@components/messenger-page/settings-modal/language-settings/language-settings';
import { NotificationsSettings } from '@components/messenger-page/settings-modal/notifications-settings/notifications-settings';
import { KeyBindings } from '@components/messenger-page/settings-modal/key-bindings/key-bindings';
import { Appearance } from '@components/messenger-page/settings-modal/appearance/appearance';
import { PrivacySecurity } from '@components/messenger-page/settings-modal/privacy-security/privacy-security';
import { AudioVideoSettings } from '@components/messenger-page/settings-modal/audio-video/audio-video';

interface IChatProps {
  preloadNext: () => void;
}

const Chat: React.FC<IChatProps> = ({ preloadNext }) => {
  const amICalledSelector = useSelector(isCallingMe);
  const amICallingSelectorSomebody = useSelector(amICallingSelector);
  const amISpeaking = useSelector(doIhaveCallSelector);

  const isCurrentChatBlackListed = useSelector(isCurrentChatBlackListedSelector);
  const isFriend = useSelector(isCurrentChatContactSelector);
  const isDismissed = useSelector(isCurrentChatDismissedAddToContactsSelector);
  const amIBlackListedByInterlocutor = useSelector(amIBlackListedByInterlocutorSelector);
  const isCurrentChatUserDeactivated = useSelector(isCurrentChatUserDeactivatedSelector);

  const internetState = useSelector(getInternetStateSelector);
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);

  useEffect(() => {
    preloadNext();
  }, [preloadNext]);

  return (
    <div className="messenger">
      {amICalledSelector && <IncomingCall />}
      {(amISpeaking || amICallingSelectorSomebody) && <ActiveCall />}
      {!internetState && <InternetError />}

      <RoutingChats />

      <Route path="/calls">
        <CallList />
        <div className="messenger__main-data">
          <AddCall />
        </div>
      </Route>

      <Route path="/chats/:chatId?/">
        <ChatList />
        <div className="messenger__chat-send">
          <MessageList />
          {isCurrentChatBlackListed ||
          amIBlackListedByInterlocutor ||
          isCurrentChatUserDeactivated ? (
            <BlockedMessageInput
              isCurrentChatBlackListed={isCurrentChatBlackListed}
              amIBlackListedByInterlocutor={amIBlackListedByInterlocutor}
              isCurrentChatUserDeactivated={isCurrentChatUserDeactivated}
            />
          ) : (
            <CreateMessageInput />
          )}
          {!isDismissed &&
            !isFriend &&
            !isCurrentChatBlackListed &&
            !amIBlackListedByInterlocutor && <NotContact />}
        </div>
        <ChatTopBar />
        <CSSTransition in={isInfoOpened} timeout={200} classNames="chat-info-slide" unmountOnExit>
          <div className="messenger__info">
            <ChatInfoRightPanel />
          </div>
        </CSSTransition>
      </Route>

      <Route path="/contacts/">
        <FriendList />
        <div className="messenger__main-data">
          <AddFriend />
        </div>
      </Route>

      <Route path="/settings/">
        <div className="messenger__settings-navigation">
          <SettingsNavigation />
        </div>
        <div className="messenger__settings-data">
          <Route path="/settings/profile">
            <EditProfile />
          </Route>

          <Route path="/settings/notifications">
            <NotificationsSettings />
          </Route>

          <Route path="/settings/language">
            <LanguageSettings />
          </Route>

          <Route path="/settings/typing">
            <KeyBindings />
          </Route>

          <Route path="/settings/appearance">
            <Appearance />
          </Route>

          <Route path="/settings/privacy-security">
            <PrivacySecurity />
          </Route>

          <Route path="/settings/audio-video">
            <AudioVideoSettings />
          </Route>
        </div>
      </Route>
    </div>
  );
};

Chat.displayName = 'Chat';

export default Chat;
