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
import RespondingMessage from 'app/components/messenger-page/responding-message/responding-message';
import { RootState } from 'app/store/root-reducer';
import CallList from 'app/components/messenger-page/call-list/call-list';
import Settings from 'app/components/messenger-page/settings/settings';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SettingsHeader from 'app/components/messenger-page/settings/settings-header';
import { LocalizationContext } from 'app/app';
import FriendList from 'app/components/messenger-page/friend-list/friend-list';

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
	const replyingMessage = useSelector((state: RootState) => state.messages.messageToReply);

	const location = useLocation();

	return (
		<div className='messenger'>
			{amICalled && <IncomingCall />}
			<ActiveCall isDisplayed={amISpeaking || amICalingSomebody} />

			<InternetError />

			<Switch location={location}>
				<Route path={'/settings/edit-profile'}>
					<SettingsHeader title={t('settings.edit_profile')} />
				</Route>

				<Route path={'/settings/notifications'}>
					<SettingsHeader title={t('settings.notifications')} />
				</Route>

				<Route path={'/settings/language'}>
					<SettingsHeader title={t('settings.language')} />
				</Route>

				<Route path={'/settings/typing'}>
					<SettingsHeader title={t('settings.text_typing')} />
				</Route>

				<Route
					exact
					path={['/(calls|settings|chats|contacts)/:chatId?/(info)?/(photo|video|audio-recordings)?']}
				>
					<RoutingChats />
				</Route>
			</Switch>

			<div className='messenger__chat-list'>
				<TransitionGroup>
					<CSSTransition
						key={location.pathname.split('/')[1]}
						timeout={{ enter: 200, exit: 200 }}
						classNames={'slide'}
					>
						<div className='messenger__chat-list__animated'>
							<Switch location={location}>
								<Route path='/calls/(info)?/(photo|video|audio-recordings)?'>
									<CallList />
								</Route>

								<Route path='/settings*'>
									<Settings />
								</Route>

								<Route path='/chats/:chatId?/(info)?/(photo|video|audio-recordings)?'>
									<div className='messenger__chats'>
										<SearchTop />
										<ChatList />
									</div>
								</Route>

								<Route path='/contacts/:chatId?/(info)?/(photo|video|audio-recordings)?'>
									<div className='messenger__chats'>
										<FriendList />
									</div>
								</Route>

								<Route path='/'>
									<Redirect
										to={{
											pathname: '/chats',
										}}
									/>
								</Route>
							</Switch>
						</div>
					</CSSTransition>
				</TransitionGroup>
			</div>

			<ChatData />

			<div className={`messenger__chat-send`}>
				<Chat />
				{replyingMessage && <RespondingMessage />}
				<CreateMessageInput />
			</div>

			<TransitionGroup style={{ gridRow: '1/3' }}>
				<CSSTransition
					key={String(location.pathname.includes('info'))}
					timeout={{ enter: 200, exit: 200 }}
					classNames={'chat-info-slide'}
				>
					<Switch location={location}>
						<Route path='/(contacts|calls|settings|chats)/:chatId?/info*'>
							<div className='chat-info--animated'>
								<ChatInfo />
							</div>
						</Route>
					</Switch>
				</CSSTransition>
			</TransitionGroup>
		</div>
	);
};

export default React.memo(Messenger);
