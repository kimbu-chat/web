import React, { useState, useRef, useCallback, useEffect } from 'react';
import './chat-info.scss';
import { useSelector } from 'react-redux';
import { useActionWithDeferred } from 'utils/hooks/use-action-with-deferred';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { AvatarSelectedData, UploadAvatarResponse } from 'store/my-profile/models';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { ChatActions } from 'store/chats/actions';
import { Avatar, ChangePhoto, FadeAnimationWrapper } from 'components';
import EditSvg from 'icons/ic-edit.svg';
import PhotoSvg from 'icons/ic-photo.svg';
import { Route } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { MyProfileActions } from 'store/my-profile/actions';
import { getInterlocutorInitials, getChatInterlocutor } from '../../../utils/functions/interlocutor-name-utils';

import { InterlocutorInfo } from './interlocutor-info/interlocutor-info';
import { ChatActions as ChatInfoActions } from './chat-actions/chat-actions';
import { ChatMembers } from './chat-members/chat-members';
import { ChatMedia } from './chat-media/chat-media';
import { ChatPhoto } from './chat-photo/chat-photo';
import { ChatVideo } from './chat-video/chat-video';

import { EditChatModal } from '../edit-chat-modal/edit-chat-modal';
import { GroupChatAddFriendModal } from '../group-chat-add-friend-modal/group-chat-add-friend-modal';
import { ChatRecordings } from './chat-recordings/chat-recordings';
import { ChatFiles } from './chat-files/chat-files';
import { BigPhoto } from '../shared/big-photo/big-photo';
import { ChatAudios } from './chat-audios/chat-audios';

export const ChatInfo: React.FC = React.memo(() => {
  const selectedChat = useSelector(getSelectedChatSelector);

  const getChatInfo = useActionWithDispatch(ChatActions.getChatInfo);
  const editGroupChat = useActionWithDispatch(ChatActions.editGroupChat);
  const uploadGroupChatAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);

  const [editGroupChatDisplayed, setEditGroupChatDisplayed] = useState(false);
  const changeEditGroupChatDisplayedState = useCallback(() => {
    setEditGroupChatDisplayed((oldState) => !oldState);
  }, [setEditGroupChatDisplayed]);

  const [addFriendsModalDisplayed, setAddFriendsModalDisplayed] = useState(false);
  const changeSetAddFriendsModalDisplayedState = useCallback(() => {
    setAddFriendsModalDisplayed((oldState) => !oldState);
  }, [setAddFriendsModalDisplayed]);

  const [imageUrl, setImageUrl] = useState<string>('');

  const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
  const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [setChangePhotoDisplayed]);
  const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [setChangePhotoDisplayed]);

  const [isAvatarMaximized, setIsAvatarMaximized] = useState(false);

  const getChatAvatar = useCallback((): string => {
    if (selectedChat?.interlocutor) {
      return selectedChat.interlocutor.avatar?.previewUrl as string;
    }

    return selectedChat?.groupChat?.avatar?.previewUrl as string;
  }, [selectedChat]);

  const changeIsAvatarMaximizedState = useCallback(() => {
    if (getChatAvatar()) {
      setIsAvatarMaximized((oldState) => !oldState);
    }
  }, [setIsAvatarMaximized]);

  useEffect(() => {
    if (selectedChat) {
      getChatInfo({ chatId: selectedChat?.id });
    }
  }, [selectedChat?.id]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const reader = new FileReader();

      reader.onload = () => {
        setImageUrl(reader.result as string);
        displayChangePhoto();
      };

      if (e.target.files) reader.readAsDataURL(e.target.files[0]);
    },
    [displayChangePhoto, setImageUrl],
  );

  const changeAvatar = useCallback(
    (data: AvatarSelectedData) => {
      uploadGroupChatAvatar({
        pathToFile: data.croppedImagePath,
      }).then((response: UploadAvatarResponse) => {
        editGroupChat({
          id: selectedChat!.groupChat!.id,
          avatar: response,
          name: selectedChat!.groupChat!.name,
          description: selectedChat!.groupChat!.description,
        });
      });
    },
    [uploadGroupChatAvatar, editGroupChat, selectedChat?.groupChat?.id],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getChatFullSizeAvatar = useCallback((): string => {
    if (selectedChat?.interlocutor) {
      return selectedChat.interlocutor.avatar?.url as string;
    }

    return selectedChat?.groupChat?.avatar?.url as string;
  }, [selectedChat]);

  if (selectedChat) {
    return (
      <>
        <div className='chat-info'>
          <div className='chat-info__main-data'>
            {!selectedChat?.groupChat && selectedChat?.interlocutor ? (
              <Avatar onClick={changeIsAvatarMaximizedState} className='chat-info__avatar' src={getChatAvatar()}>
                {getInterlocutorInitials(selectedChat)}
              </Avatar>
            ) : (
              <div className='chat-info__avatar-group'>
                <Avatar onClick={changeIsAvatarMaximizedState} className='chat-info__avatar' src={getChatAvatar()}>
                  {getInterlocutorInitials(selectedChat)}
                </Avatar>
                <div onClick={() => fileInputRef.current?.click()} className={getChatAvatar() ? 'change-avatar change-avatar--hidden' : 'change-avatar'}>
                  <PhotoSvg className='change-avatar__svg' viewBox='0 0 25 25' />
                </div>
              </div>
            )}
            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e)} ref={fileInputRef} type='file' hidden accept='image/*' />
            <span className='chat-info__interlocutor'>{getChatInterlocutor(selectedChat)}</span>
            {selectedChat?.groupChat && (
              <button type='button' onClick={changeEditGroupChatDisplayedState} className='chat-info__rename-btn'>
                <EditSvg />
              </button>
            )}
          </div>
          <InterlocutorInfo />

          <ChatInfoActions addMembers={changeSetAddFriendsModalDisplayedState} />

          <ChatMedia />

          {selectedChat?.groupChat && <ChatMembers addMembers={changeSetAddFriendsModalDisplayedState} />}
        </div>

        <Route path='/(contacts|calls|settings|chats)/:chatId?/info/photo' exact>
          {({ match }) => (
            <CSSTransition in={match != null} timeout={200} classNames='chat-info__nested-slide' unmountOnExit>
              <ChatPhoto />
            </CSSTransition>
          )}
        </Route>

        <Route path='/(contacts|calls|settings|chats)/:chatId?/info/audio-recordings' exact>
          {({ match }) => (
            <CSSTransition in={match != null} timeout={200} classNames='chat-info__nested-slide' unmountOnExit>
              <ChatRecordings />
            </CSSTransition>
          )}
        </Route>

        <Route path='/(contacts|calls|settings|chats)/:chatId?/info/video' exact>
          {({ match }) => (
            <CSSTransition in={match != null} timeout={200} classNames='chat-info__nested-slide' unmountOnExit>
              <ChatVideo />
            </CSSTransition>
          )}
        </Route>

        <Route path='/(contacts|calls|settings|chats)/:chatId?/info/files' exact>
          {({ match }) => (
            <CSSTransition in={match != null} timeout={200} classNames='chat-info__nested-slide' unmountOnExit>
              <ChatFiles />
            </CSSTransition>
          )}
        </Route>

        <Route path='/(contacts|calls|settings|chats)/:chatId?/info/audios' exact>
          {({ match }) => (
            <CSSTransition in={match != null} timeout={200} classNames='chat-info__nested-slide' unmountOnExit>
              <ChatAudios />
            </CSSTransition>
          )}
        </Route>

        <FadeAnimationWrapper isDisplayed={editGroupChatDisplayed}>
          <EditChatModal onClose={changeEditGroupChatDisplayedState} />
        </FadeAnimationWrapper>

        <FadeAnimationWrapper isDisplayed={addFriendsModalDisplayed}>
          <GroupChatAddFriendModal onClose={changeSetAddFriendsModalDisplayedState} />
        </FadeAnimationWrapper>

        <FadeAnimationWrapper isDisplayed={isAvatarMaximized}>
          <BigPhoto url={getChatFullSizeAvatar()} onClose={changeIsAvatarMaximizedState} />
        </FadeAnimationWrapper>

        {changePhotoDisplayed && <ChangePhoto hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={changeAvatar} />}
      </>
    );
  }
  return <div />;
});
