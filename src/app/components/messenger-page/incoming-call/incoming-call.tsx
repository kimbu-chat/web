import React, { useEffect, useCallback, useContext } from 'react';
import './incoming-call.scss';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { CallActions } from 'store/calls/actions';
import { useSelector } from 'react-redux';
import { getCallInterlocutorSelector, getIsIncomingCallVideoEnabledSelector } from 'store/calls/selectors';
import { Avatar } from 'components';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';

// sounds
import incomingCallSound from 'app/assets/sounds/calls/imcoming-call.ogg';
import { Rnd } from 'react-rnd';
import ReactDOM from 'react-dom';

// svgs
import AcceptWithAudioSvg from 'icons/ic-call-filled.svg';
import AcceptWithVideoSvg from 'icons/ic-video-call-filled.svg';
import DeclineCallSvg from 'icons/ic-call-out.svg';
import { LocalizationContext } from 'app/app';

export const IncomingCall: React.FC = () => {
  const { t } = useContext(LocalizationContext);
  const declineCallAction = useActionWithDispatch(CallActions.declineCallAction);
  const acceptCall = useActionWithDispatch(CallActions.acceptCallAction);

  const interlocutor = useSelector(getCallInterlocutorSelector);
  const isIncomingCallVideoEnabled = useSelector(getIsIncomingCallVideoEnabledSelector);

  useEffect(() => {
    // repeatable playing beep-beep
    const audio = new Audio(incomingCallSound);

    audio.addEventListener('ended', audio.play, false);

    audio.play();

    return () => {
      audio.pause();
      audio.removeEventListener('ended', audio.play);
      audio.currentTime = 0;
    };
  });

  const acceptWithVideo = useCallback(() => {
    acceptCall({
      videoEnabled: true,
      audioEnabled: true,
    });
  }, []);

  const acceptWithAudio = useCallback(() => {
    acceptCall({
      videoEnabled: false,
      audioEnabled: true,
    });
  }, []);

  return ReactDOM.createPortal(
    <Rnd
      default={{
        x: 20,
        y: 20,
        width: window.innerWidth - 40,
        height: 100,
      }}
      bounds='body'
    >
      <div className='incoming-call'>
        <Avatar className='incoming-call__img' src={interlocutor?.avatar?.previewUrl}>
          {getUserInitials(interlocutor)}
        </Avatar>
        <div className='incoming-call__info'>
          <h1 className='incoming-call__calling-name'>{`${interlocutor?.firstName} ${interlocutor?.lastName}`}</h1>
          <h3 className='incoming-call__additional-data'>{isIncomingCallVideoEnabled ? t('incomingCall.incoming_video') : t('incomingCall.incoming_audio')}</h3>
        </div>
        <div className='incoming-call__right-btns'>
          <button type='button' onClick={acceptWithAudio} className='incoming-call__call-btn incoming-call__call-btn--accept'>
            <AcceptWithAudioSvg viewBox='0 0 25 25' />
          </button>
          <button type='button' onClick={declineCallAction} className='incoming-call__call-btn incoming-call__call-btn--cancel'>
            <DeclineCallSvg viewBox='0 0 25 25' />
          </button>
          <button type='button' onClick={acceptWithVideo} className='incoming-call__call-btn incoming-call__call-btn--video'>
            <AcceptWithVideoSvg viewBox='0 0 25 25' />
          </button>
        </div>
      </div>
    </Rnd>,
    document.getElementById('root') || document.createElement('div'),
  );
};
