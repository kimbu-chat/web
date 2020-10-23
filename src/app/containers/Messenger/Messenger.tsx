import React, { useState, useEffect, useCallback, useContext } from 'react';
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
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { isCallingMe, amICaling, doIhaveCall } from 'app/store/calls/selectors';
import RespondingMessage from 'app/components/messenger-page/responding-message/responding-message';
import { RootState } from 'app/store/root-reducer';
import CallList from 'app/components/messenger-page/call-list/call-list';
import Settings from 'app/components/messenger-page/settings/settings';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SettingsHeader from 'app/components/messenger-page/settings/settings-header';
import { LocalizationContext } from 'app/app';

export namespace Messenger {
	export interface photoSelect {
		isDisplayed?: boolean;
		onSubmit?: (data: AvatarSelectedData) => void;
	}
}

const Messenger = () => {
	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector);
	const amICalled = useSelector(isCallingMe);
	const amICalingSomebody = useSelector(amICaling);
	const amISpeaking = useSelector(doIhaveCall);
	const replyingMessage = useSelector((state: RootState) => state.messages.messageToReply);

	const [infoDisplayed, setInfoDisplayed] = useState(false);

	//hide chatInfo on chat change
	useEffect(() => hideChatInfo(), [selectedChat?.id]);

	//Chat info display and hide
	const displayChatInfo = useCallback(() => {
		setInfoDisplayed((oldDisplayedState) => !oldDisplayedState);
	}, [setInfoDisplayed]);
	const hideChatInfo = useCallback(() => {
		setInfoDisplayed(false);
	}, [setInfoDisplayed]);

	const location = useLocation();

	return (
		<div className='messenger'>
			{amICalled && <IncomingCall />}
			<ActiveCall isDisplayed={amISpeaking || amICalingSomebody} />

			<InternetError />

			<Switch location={location}>
				<Route exact path={['/calls', '/settings', '/chats/:chatId?', '/contacts']}>
					<RoutingChats />
				</Route>

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
								<Route path='/calls'>
									<CallList />
								</Route>

								<Route path='/settings'>
									<Settings />
								</Route>

								<Route path='/chats/:chatId?'>
									<div className='messenger__chats'>
										<SearchTop />
										<ChatList />
									</div>
								</Route>

								<Route path='/contacts'>
									<div className='messenger__chats'>FRIENDS</div>
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

			<ChatData chatInfoDisplayed={infoDisplayed} displayChatInfo={displayChatInfo} />

			<div className={`messenger__chat-send ${infoDisplayed ? 'messenger__chat-send--little' : ''}`}>
				<Chat />
				{replyingMessage && <RespondingMessage />}
				<CreateMessageInput />
			</div>
			<ChatInfo isDisplayed={infoDisplayed} />
		</div>
	);
};

export default React.memo(Messenger);
