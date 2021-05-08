import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';
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
import {
  amIBlackListedByInterlocutorSelector,
  isCurrentChatBlackListedSelector,
  isCurrentChatDismissedAddToContactsSelector,
  isCurrentChatContactSelector,
  isCurrentChatUserDeactivatedSelector,
  isCurrentChatUserDeletedSelector,
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
  const isCurrentChatUserDeleted = useSelector(isCurrentChatUserDeletedSelector);

  const internetState = useSelector(getInternetStateSelector);

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
          isCurrentChatUserDeactivated ||
          isCurrentChatUserDeleted ? (
            <BlockedMessageInput
              isCurrentChatBlackListed={isCurrentChatBlackListed}
              amIBlackListedByInterlocutor={amIBlackListedByInterlocutor}
              isCurrentChatUserDeactivated={isCurrentChatUserDeactivated}
              isCurrentChatUserDeleted={isCurrentChatUserDeleted}
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
        <ChatInfoRightPanel />
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
          <Switch>
            <Route exact path="/settings/profile">
              <EditProfile />
            </Route>

            <Route exact path="/settings/notifications">
              <NotificationsSettings />
            </Route>

            <Route exact path="/settings/language">
              <LanguageSettings />
            </Route>

            <Route exact path="/settings/typing">
              <KeyBindings />
            </Route>

            <Route exact path="/settings/appearance">
              <Appearance />
            </Route>

            <Route exact path="/settings/privacy-security">
              <PrivacySecurity />
            </Route>

            <Route exact path="/settings/audio-video">
              <AudioVideoSettings />
            </Route>

            <Route>
              <Redirect to="/settings/profile" />
            </Route>
          </Switch>
        </div>
      </Route>
    </div>
  );
};

Chat.displayName = 'Chat';

export default Chat;
