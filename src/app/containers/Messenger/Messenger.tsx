import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import './messenger.scss';

import SearchTop from '../../components/messenger-page/search-top/search-top';
import ChatData from '../../components/messenger-page/chat-data/chat-data';

import ChatList from '../../components/messenger-page/chat-list/chat-list';
import Chat from '../../components/messenger-page/chat/chat';
import CreateMessageInput from '../../components/messenger-page/message-input/message-input';
import ChatInfo from '../../components/messenger-page/chat-info/chat-info';
import InternetError from 'app/components/shared/internet-error/internet-error';
import IncomingCall from 'messenger_components/incoming-call/incoming-call';
import ActiveCall from 'messenger_components/active-call/active-call';
import RoutingChats from 'messenger_components/routing-chats/routing-chats';

import { AvatarSelectedData } from 'store/my-profile/models';
import { useSelector } from 'react-redux';
import { isCallingMe, amICaling, doIhaveCall } from 'store/calls/selectors';
import CallList from 'messenger_components/call-list/call-list';
import Settings from 'messenger_components/settings/settings';
import { CSSTransition } from 'react-transition-group';
import SettingsHeader from 'messenger_components/settings/settings-header';
import { LocalizationContext } from 'app/app';
import FriendList from 'messenger_components/friend-list/friend-list';
import { getSelectedChatSelector } from 'store/chats/selectors';
import EditMessage from 'messenger_components/message-input/edit-message/edit-message';
import { RootState } from 'store/root-reducer';

export namespace Messenger {
	export interface photoSelect {
		isDisplayed?: boolean;
		onSubmit?: (data: AvatarSelectedData) => void;
	}
}

export const Messenger = React.memo(() => {
	const { t } = useContext(LocalizationContext);

	const amICalled = useSelector(isCallingMe);
	const amICalingSomebody = useSelector(amICaling);
	const amISpeaking = useSelector(doIhaveCall);
	const selectedChat = useSelector(getSelectedChatSelector);
	const messageToEdit = useSelector((state: RootState) => state.messages.messageToEdit);

	return (
		<div className='messenger'>
			{amICalled && <IncomingCall />}
			<ActiveCall isDisplayed={amISpeaking || amICalingSomebody} />

			<InternetError />

			<Switch>
				<Route exact path={'/settings/edit-profile/(info)?/(photo|video|audio-recordings|files|audios)?'}>
					<SettingsHeader title={t('settings.edit_profile')} />
				</Route>

				<Route exact path={'/settings/notifications/(info)?/(photo|video|audio-recordings|files|audios)?'}>
					<SettingsHeader title={t('settings.notifications')} />
				</Route>

				<Route exact path={'/settings/language/(info)?/(photo|video|audio-recordings|files|audios)?'}>
					<SettingsHeader title={t('settings.language')} />
				</Route>

				<Route exact path={'/settings/typing/(info)?/(photo|video|audio-recordings|files|audios)?'}>
					<SettingsHeader title={t('settings.text_typing')} />
				</Route>

				<Route
					exact
					path={[
						'/(calls|settings|chats|contacts)/:chatId?/(info)?/(photo|video|audio-recordings|files|audios)?',
					]}
				>
					<RoutingChats />
				</Route>

				<Route path='/'>
					<Redirect
						to={{
							pathname: `/chats${selectedChat ? `/${selectedChat.id}` : ''}`,
						}}
					/>
				</Route>
			</Switch>

			<div className='messenger__chat-list'>
				<div className='messenger__chat-list__animated'>
					<Route path='/calls/(info)?/(photo|video|audio-recordings|files|audios)?'>
						{({ match }) => (
							<CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
								<CallList />
							</CSSTransition>
						)}
					</Route>

					<Route path='/settings/(edit-profile|notifications|language|typing)?/(info)?/(photo|video|audio-recordings|files|audios)?'>
						{({ match }) => (
							<CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
								<Settings />
							</CSSTransition>
						)}
					</Route>

					<Route path='/chats/:chatId?/(info)?/(photo|video|audio-recordings|files|audios)?'>
						{({ match }) => (
							<CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
								<div className='messenger__chats'>
									<SearchTop />
									<ChatList />
								</div>
							</CSSTransition>
						)}
					</Route>

					<Route path='/contacts/:chatId?/(info)?/(photo|video|audio-recordings|files|audios)?'>
						{({ match }) => (
							<CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
								<div className='messenger__chats'>
									<FriendList />
								</div>
							</CSSTransition>
						)}
					</Route>
				</div>
			</div>

			<ChatData />

			<div className={`messenger__chat-send`}>
				<Chat />
				{!messageToEdit && <CreateMessageInput />}
				{messageToEdit && <EditMessage />}
			</div>

			<Route path='/(contacts|calls|settings|chats)/:chatId?/info'>
				{({ match }) => (
					<CSSTransition in={match != null} timeout={200} classNames='chat-info-slide' unmountOnExit>
						<div className='messenger__info'>
							<ChatInfo />
						</div>
					</CSSTransition>
				)}
			</Route>
		</div>
	);
});
