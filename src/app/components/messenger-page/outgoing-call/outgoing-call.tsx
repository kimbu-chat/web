import React, { useEffect } from 'react';
import './outgoing-call.scss';

//sounds
import callingBeep from 'app/sounds/calls/outgoing-call.ogg';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { CallActions } from 'app/store/calls/actions';

const OutgoingCall = () => {
	const cancelCall = useActionWithDispatch(CallActions.cancelCallAction);

	useEffect(() => {
		//repeatable playing beep-beep
		const audio = new Audio(callingBeep);

		const repeatAudio = function () {
			audio.play();
		};

		audio.addEventListener('ended', repeatAudio, false);

		audio.play();

		return () => {
			audio.pause();
			audio.removeEventListener('ended', repeatAudio);
			audio.currentTime = 0;
		};
	});
	return (
		<div className='outgoing-call'>
			<div className='outgoing-call__menu'>
				<div className='svg'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
						<path
							fillRule='evenodd'
							d='M7.952 1.2a6.269 6.269 0 0 0-6.266 6.266 6.22 6.22 0 0 0 1.506 4.068l-.001 1.616v.536a1.522 1.522 0 0 0 2.34 1.284L7.5 13.716a6.269 6.269 0 0 0 6.72-6.25A6.269 6.269 0 0 0 7.951 1.2zm-1.08 11.018L4.79 13.544v-2.246l.003-.008a.8.8 0 0 0-.22-.614 4.62 4.62 0 0 1-1.288-3.21A4.669 4.669 0 0 1 7.952 2.8a4.669 4.669 0 0 1 4.666 4.666A4.669 4.669 0 0 1 7.402 12.1a.8.8 0 0 0-.53.119z'
							clipRule='evenodd'
						></path>
					</svg>
				</div>
			</div>
			<img
				src='https://d18j2ovy2glyrp.cloudfront.net/2020/07/24/fa7969a484d64b25a3c61a449ed492a6/image_143x143.jpeg'
				alt=''
				className='outgoing-call__img'
			/>
			<div className='outgoing-call__bottom-menu'>
				<button className='outgoing-call__call-btn outgoing-call__call-btn--microphone'>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path
								fillRule='evenodd'
								d='M11.8 3.96a3.8 3.8 0 0 0-7.6 0v3.11a3.8 3.8 0 1 0 7.6 0v-3.1zm-1.6 0v3.11a2.2 2.2 0 0 1-4.4 0v-3.1a2.2 2.2 0 1 1 4.4 0zm2.6 3.47a4.79 4.79 0 0 1-4.81 4.73 4.79 4.79 0 0 1-4.82-4.73.8.8 0 1 0-1.6 0 6.3 6.3 0 0 0 5.4 6.26v1.28a1 1 0 1 0 2 0v-1.28a6.38 6.38 0 0 0 5.42-6.26.8.8 0 0 0-1.6 0z'
							></path>
						</svg>
					</div>
				</button>
				<button className='outgoing-call__call-btn outgoing-call__call-btn--cancel' onClick={cancelCall}>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path
								fillRule='evenodd'
								d='M.18 8.24C.13 6.02 3.09 3.8 7.98 3.8c4.9 0 7.84 2.18 7.8 4.44v.56l.01.53a1.8 1.8 0 01-1.8 1.83h-1.58a1.8 1.8 0 01-1.8-1.68l-.07-1.12-.15-.03c-.63-.14-1.31-.24-2-.27H8c-.97 0-1.9.14-2.68.35l.2-.05-.07 1.13a1.8 1.8 0 01-1.8 1.67H2A1.8 1.8 0 01.2 9.4L.18 8.24zm12.9-1.55c-1.07-.8-2.77-1.29-5.1-1.29-2.34 0-4.03.5-5.12 1.31-.72.54-1.09 1.19-1.08 1.5l.02 1.16c0 .1.09.2.2.2h1.64c.1 0 .2-.09.2-.2l.1-1.34c.03-.54.4-1 .94-1.16a12.14 12.14 0 016.3 0c.52.15.9.62.94 1.17l.09 1.34c0 .1.1.18.2.18h1.58a.2.2 0 00.14-.06.2.2 0 00.06-.13l-.02-.84V8.2c.01-.35-.36-.99-1.08-1.52z'
								clipRule='evenodd'
							></path>
						</svg>
					</div>
				</button>
				<button className='outgoing-call__call-btn outgoing-call__call-btn--video'>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path
								fillRule='evenodd'
								d='M1.67 1.52A.9.9 0 00.49 2.88l11.67 11.54.1.08a.9.9 0 001.17-1.36l-1.99-1.97V9.73l2.4 1.77a1.3 1.3 0 002.07-1.04V5.52a1.3 1.3 0 00-2.07-1.05l-2.4 1.75V5a2.3 2.3 0 00-2.3-2.3H5.64c-.79 0-1.56.17-2.25.5L1.76 1.6l-.1-.08zm2.96 2.92L9.85 9.6V5a.7.7 0 00-.7-.7H5.63c-.34 0-.68.04-1 .14zM.32 8c0-.74.15-1.46.44-2.12l1.26 1.25a3.73 3.73 0 003.6 4.58h1.02l1.61 1.6H5.63a5.31 5.31 0 01-5.31-5.3zm13.99-1.9v3.75l-2.55-1.89 2.55-1.86z'
								clipRule='evenodd'
							></path>
						</svg>
					</div>
				</button>
			</div>
		</div>
	);
};

export default OutgoingCall;
