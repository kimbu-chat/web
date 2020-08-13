import React from 'react';
import './incoming-call.scss';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { CallActions } from 'app/store/calls/actions';

const IncomingCall = () => {
	const cancelCall = useActionWithDispatch(CallActions.cancelCallAction);
	const acceptCall = useActionWithDispatch(CallActions.acceptCallAction);

	return (
		<div className='incoming-call'>
			<img
				src='https://d18j2ovy2glyrp.cloudfront.net/2020/07/24/fa7969a484d64b25a3c61a449ed492a6/image_143x143.jpeg'
				alt=''
				className='incoming-call__img'
			/>
			<h1 className='incoming-call__calling-name'>Stef</h1>
			<h3 className='incoming-call__additional-data'>Входящий аудиовыхов</h3>
			<div className='incoming-call__bottom-menu'>
				<button onClick={acceptCall} className='incoming-call__call-btn incoming-call__call-btn--accept'>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path
								fillRule='evenodd'
								d='M10.53 9.94l.36-.18a1.8 1.8 0 012.35.72l.44.75.4.72a1.8 1.8 0 01-.62 2.44l-1.02.61c-1.92 1.17-5.36-.31-7.84-4.6-2.48-4.3-2.07-7.98-.06-9.09.16-.08.5-.3.96-.57A1.8 1.8 0 018 1.38l.38.67.44.75a1.8 1.8 0 01-.56 2.4c-.54.36-.62.4-.96.64a10.7 10.7 0 002.56 4.44l.68-.34zm2.1 3.08a.2.2 0 00.07-.27l-.4-.72-.44-.75a.2.2 0 00-.26-.08l-.36.17-.9.44a1.3 1.3 0 01-1.47-.24 12.3 12.3 0 01-3.2-5.54 1.3 1.3 0 01.54-1.4l1.15-.77a.2.2 0 00.06-.26L7 2.85l-.39-.67a.2.2 0 00-.27-.08c-.47.3-.83.51-1.02.62-.3.17-.69.82-.79 1.73C4.37 5.8 4.8 7.55 6 9.6c1.18 2.06 2.48 3.3 3.75 3.84.84.36 1.6.36 1.87.2l1.02-.62z'
								clipRule='evenodd'
							></path>
						</svg>
					</div>
				</button>
				<button onClick={cancelCall} className='incoming-call__call-btn incoming-call__call-btn--cancel'>
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
				<button className='incoming-call__call-btn incoming-call__call-btn--video'>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path
								fillRule='evenodd'
								d='M11.32 5a2.3 2.3 0 0 0-2.3-2.3H5.5a5.31 5.31 0 1 0 0 10.62h3.52a2.3 2.3 0 0 0 2.3-2.3V9.73l.84.62 1.55 1.15a1.3 1.3 0 0 0 2.07-1.04V5.52a1.3 1.3 0 0 0-2.06-1.05L12.16 5.6l-.84.62V5zm-1.6 0v6.02a.7.7 0 0 1-.7.7H5.5a3.71 3.71 0 0 1 0-7.42h3.52a.7.7 0 0 1 .7.7zm4.46 4.86l-1.07-.8-1.48-1.09L13.1 6.9l1.08-.79v3.75z'
								clipRule='evenodd'
							></path>
						</svg>
					</div>
				</button>
			</div>
		</div>
	);
};

export default IncomingCall;
