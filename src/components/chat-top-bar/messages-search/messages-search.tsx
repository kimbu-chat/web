import React, { useCallback, useState, useLayoutEffect } from 'react';

import classNames from 'classnames';
import { useSelector } from 'react-redux';

// import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';
import { SearchBox } from '@components/search-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useAnimation } from '@hooks/use-animation';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as SearchSvg } from '@icons/search.svg';
import { getMessagesAction } from '@store/chats/actions';
import { getSelectedChatMessagesSearchStringSelector } from '@store/chats/selectors';

import './messages-search.scss';

const BLOCK_NAME = 'messages-search';

const MessagesSearch = () => {
  const messagesSearchString = useSelector(getSelectedChatMessagesSearchStringSelector);

  const getMessages = useActionWithDispatch(getMessagesAction);

  const [isSearching, setIsSearching] = useState(false);
  const openSearchingState = useCallback(() => {
    setIsSearching(true);
  }, [setIsSearching]);

  const closeSearchingState = useCallback(() => {
    if (isSearching) {
      setIsSearching(false);

      if (messagesSearchString) {
        getMessages({
          initializedByScroll: false,
        });
      }
    }
  }, [isSearching, getMessages, messagesSearchString]);

  const resetSearch = useCallback(() => {
    getMessages({
      initializedByScroll: false,
    });
  }, [getMessages]);

  const searchMessages = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      getMessages({
        initializedByScroll: false,
        searchString: e.target.value,
      });
    },
    [getMessages],
  );

  const { rootClass, animatedClose } = useAnimation(
    `${BLOCK_NAME}__search-box`,
    closeSearchingState,
  );

  const [animatedSearchOpened, setAnimatedSearchOpened] = useState(false);

  const toggleSearchOpened = useCallback(() => {
    if (isSearching) {
      animatedClose();
    } else {
      openSearchingState();
    }
  }, [isSearching, animatedClose, openSearchingState]);

  useLayoutEffect(() => {
    setTimeout(() => {
      setAnimatedSearchOpened(isSearching);
    }, 0);
  }, [isSearching]);

  return (
    <div className={BLOCK_NAME}>
      {(isSearching || messagesSearchString?.length) && (
        <div className={classNames(rootClass, { [`${rootClass}--open`]: animatedSearchOpened })}>
          <SearchBox
            containerClassName={`${BLOCK_NAME}__input-container`}
            autoFocus
            value={messagesSearchString || ''}
            onChange={searchMessages}
          />
          {Boolean(messagesSearchString?.length) && (
            <button onClick={resetSearch} type="button" className={`${BLOCK_NAME}__close`}>
              <CloseSvg />
            </button>
          )}

          {/*
          //TODO: Use this block for navigation between found messages
          <div className="messages-search__pointer-container">
            <span className="messages-search__pointer-container__data">1/3</span>
            <div className="messages-search__pointer-arrows">
              <button
                type="button"
                className="className='messages-search__pointer-arrow messages-search__pointer-arrow--top">
                <ArrowSvg  />
              </button>

              <button
                type="button"
                className="className='messages-search__pointer-arrow messages-search__pointer-arrow--bottom">
                <ArrowSvg  />
              </button>
            </div>
          </div> */}
        </div>
      )}

      <button
        type="button"
        onClick={toggleSearchOpened}
        className={classNames('chat-data__button', {
          'chat-data__button--active': animatedSearchOpened,
        })}>
        <SearchSvg />
      </button>
    </div>
  );
};

MessagesSearch.displayName = 'MessagesSearch';

export { MessagesSearch };
