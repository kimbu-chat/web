import React, { useContext } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router';
import './messenger.scss';

import SearchTop from '../../components/messenger-page/search-top/search-top';
import ChatData from '../../components/messenger-page/chat-data/chat-data';

import ChatList from '../../components/messenger-page/chat-list/chat-list';
import Chat from '../../components/messenger-page/chat/chat';
import CreateMessageInput from '../../components/messenger-page/message-input/message-input';
import ChatInfo from '../../components/messenger-page/chat-info/chat-info';
import InternetError from 'app/components/shared/internet-error/internet-error';
import IncomingCall from 'app/components/messenger-page/incoming-call/incoming-call';
import ActiveCall from 'app/components/messenger-page/active-call/active-call';
import RoutingChats from 'app/components/messenger-page/routing-chats/routing-chats';

import { AvatarSelectedData } from 'app/store/my-profile/models';
import { useSelector } from 'react-redux';
import { isCallingMe, amICaling, doIhaveCall } from 'app/store/calls/selectors';
import CallList from 'app/components/messenger-page/call-list/call-list';
import Settings from 'app/components/messenger-page/settings/settings';
import { CSSTransition } from 'react-transition-group';
import SettingsHeader from 'app/components/messenger-page/settings/settings-header';
import { LocalizationContext } from 'app/app';
import FriendList from 'app/components/messenger-page/friend-list/friend-list';
import { getSelectedChatSelector } from 'app/store/chats/selectors';

export namespace Messenger {
	export interface photoSelect {
		isDisplayed?: boolean;
		onSubmit?: (data: AvatarSelectedData) => void;
	}
}

const Messenger = () => {
	const { t } = useContext(LocalizationContext);

	const amICalled = useSelector(isCallingMe);
	const amICalingSomebody = useSelector(amICaling);
	const amISpeaking = useSelector(doIhaveCall);
	const selectedChat = useSelector(getSelectedChatSelector);

	const location = useLocation();

	return (
		<div className='messenger'>
			{amICalled && <IncomingCall />}
			<ActiveCall isDisplayed={amISpeaking || amICalingSomebody} />

			<InternetError />

			<Switch location={location}>
				<Route exact path={'/settings/edit-profile'}>
					<SettingsHeader title={t('settings.edit_profile')} />
				</Route>

				<Route exact path={'/settings/notifications'}>
					<SettingsHeader title={t('settings.notifications')} />
				</Route>

				<Route exact path={'/settings/language'}>
					<SettingsHeader title={t('settings.language')} />
				</Route>

				<Route exact path={'/settings/typing'}>
					<SettingsHeader title={t('settings.text_typing')} />
				</Route>

				<Route
					exact
					path={['/(calls|settings|chats|contacts)/:chatId?/(info)?/(photo|video|audio-recordings|files)?']}
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
					<Route path='/calls/(info)?/(photo|video|audio-recordings|files)?'>
						{({ match }) => (
							<CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
								<CallList />
							</CSSTransition>
						)}
					</Route>

					<Route path='/settings/(info)?/(photo|video|audio-recordings|files)?'>
						{({ match }) => (
							<CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
								<Settings />
							</CSSTransition>
						)}
					</Route>

					<Route path='/chats/:chatId?/(info)?/(photo|video|audio-recordings|files)?'>
						{({ match }) => (
							<CSSTransition in={match != null} timeout={200} classNames='slide' unmountOnExit>
								<div className='messenger__chats'>
									<SearchTop />
									<ChatList />
								</div>
							</CSSTransition>
						)}
					</Route>

					<Route path='/contacts/:chatId?/(info)?/(photo|video|audio-recordings|files)?'>
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
				<CreateMessageInput />
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
};

export default React.memo(Messenger);
