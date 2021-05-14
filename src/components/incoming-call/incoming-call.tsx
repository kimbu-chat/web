import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { declineCallAction, acceptCallAction } from '@store/calls/actions';
import {
  getCallInterlocutorSelector,
  getIsIncomingCallVideoEnabledSelector,
} from '@store/calls/selectors';
import { Avatar } from '@components';
// sounds
import incomingCallSound from '@sounds/calls/imcoming-call.ogg';
// svgs
import { ReactComponent as AcceptWithAudioSvg } from '@icons/audio-call.svg';
import { ReactComponent as AcceptWithVideoSvg } from '@icons/video-call.svg';
import { ReactComponent as DeclineCallSvg } from '@icons/declined-call.svg';
import { playSoundSafely } from '@utils/current-music';

import './incoming-call.scss';

export const IncomingCall: React.FC = () => {
  const { t } = useTranslation();
  const declineCall = useActionWithDispatch(declineCallAction);
  const acceptCall = useActionWithDispatch(acceptCallAction);

  const interlocutor = useSelector(getCallInterlocutorSelector);
  const isIncomingCallVideoEnabled = useSelector(getIsIncomingCallVideoEnabledSelector);

  useEffect(() => {
    // repeatable playing beep-beep
    const audio = new Audio(incomingCallSound);

    audio.addEventListener('ended', audio.play, false);

    playSoundSafely(audio);

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
  }, [acceptCall]);

  const acceptWithAudio = useCallback(() => {
    acceptCall({
      videoEnabled: false,
      audioEnabled: true,
    });
  }, [acceptCall]);

  return ReactDOM.createPortal(
    <Rnd
      default={{
        x: 60,
        y: 20,
        width: window.innerWidth - 120,
        height: 64,
      }}
      bounds="body"
      className="incoming-call-draggable">
      <div className="incoming-call">
        <Avatar className="incoming-call__img" user={interlocutor} />
        <div className="incoming-call__info">
          <h1 className="incoming-call__calling-name">{`${interlocutor?.firstName} ${interlocutor?.lastName}`}</h1>
          <h3 className="incoming-call__additional-data">
            {isIncomingCallVideoEnabled
              ? t('incomingCall.incoming_video')
              : t('incomingCall.incoming_audio')}
          </h3>
        </div>
        <div className="incoming-call__right-btns">
          <button
            type="button"
            onClick={acceptWithAudio}
            className="incoming-call__call-btn incoming-call__call-btn--accept">
            <AcceptWithAudioSvg viewBox="0 0 24 24" />
          </button>
          <button
            type="button"
            onClick={acceptWithVideo}
            className="incoming-call__call-btn incoming-call__call-btn--video">
            <AcceptWithVideoSvg viewBox="0 0 24 24" />
          </button>
          <button
            type="button"
            onClick={declineCall}
            className="incoming-call__call-btn incoming-call__call-btn--cancel">
            <DeclineCallSvg viewBox="0 0 13 14" />
          </button>
        </div>
      </div>
    </Rnd>,
    document.getElementById('root') || document.createElement('div'),
  );
};