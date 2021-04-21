import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as SearchSvg } from '@icons/search.svg';
// import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';

import { MESSAGES_LIMIT } from '@utils/pagination-limits';
import './messages-search.scss';
import { SearchBox } from '@components/messenger-page';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import {
  getSelectedChatIdSelector,
  getSelectedChatMessagesSearchStringSelector,
} from '@store/chats/selectors';
import { useSelector } from 'react-redux';
import { getMessagesAction } from '@store/chats/actions';

const MessagesSearch = () => {
  const messagesSearchString = useSelector(getSelectedChatMessagesSearchStringSelector);
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const getMessages = useActionWithDispatch(getMessagesAction);

  const [isSearching, setIsSearching] = useState(false);
  const changeSearchingState = useCallback(() => {
    setIsSearching((oldState) => !oldState);
  }, [setIsSearching]);

  const searchMessages = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const pageData = {
        limit: MESSAGES_LIMIT,
        offset: 0,
      };

      getMessages({
        page: pageData,
        isFromSearch: true,
        searchString: e.target.value,
      });
    },
    [getMessages],
  );

  useEffect(() => {
    setIsSearching(false);
  }, [selectedChatId, setIsSearching]);

  return (
    <div className="messages-search">
      {isSearching || messagesSearchString?.length ? (
        <>
          <SearchBox
            containerClassName="messages-search__input-container"
            value={messagesSearchString || ''}
            onChange={searchMessages}
          />
          {/*
          //TODO: Use this block for navigation between found messages 
          <div className="messages-search__pointer-container">
            <span className="messages-search__pointer-container__data">1/3</span>
            <div className="messages-search__pointer-arrows">
              <button
                type="button"
                className="className='messages-search__pointer-arrow messages-search__pointer-arrow--top">
                <ArrowSvg viewBox="0 0 8 14" />
              </button>

              <button
                type="button"
                className="className='messages-search__pointer-arrow messages-search__pointer-arrow--bottom">
                <ArrowSvg viewBox="0 0 8 14" />
              </button>
            </div>
          </div> */}
        </>
      ) : (
        <button type="button" onClick={changeSearchingState} className="chat-data__button">
          <SearchSvg />
        </button>
      )}
    </div>
  );
};

MessagesSearch.displayName = 'MessagesSearch';

export { MessagesSearch };
