import React, { useCallback, useState } from 'react';
import SearchSvg from '@icons/search.svg';
import ArrowSvg from '@icons/arrow-v.svg';

import { GetMessages } from '@store/chats/features/get-messages/get-messages';
import { MESSAGES_LIMIT } from '@utils/pagination-limits';
import './messages-search.scss';
import { SearchBox } from '@components';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getSelectedChatMessagesSearchStringSelector } from '@store/chats/selectors';
import { useSelector } from 'react-redux';

export const MessagesSearch = () => {
  const messagesSearchString = useSelector(getSelectedChatMessagesSearchStringSelector);

  const getMessages = useActionWithDispatch(GetMessages.action);

  const [isSearching, setIsSearching] = useState(false);
  const changeSearchingState = useCallback(() => {
    setIsSearching((oldState) => !oldState);
  }, [setIsSearching]);

  const searchMessages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pageData = {
      limit: MESSAGES_LIMIT,
      offset: 0,
    };

    getMessages({
      page: pageData,
      isFromSearch: true,
      searchString: e.target.value,
    });
  }, []);

  return (
    <div className='messages-search'>
      {isSearching || (messagesSearchString?.length || 0) > 0 ? (
        <>
          <SearchBox containerClassName='messages-search__input-container' value={messagesSearchString || ''} onChange={searchMessages} />
          <div className='messages-search__pointer-container'>
            <span className='messages-search__pointer-container__data'>1/3</span>
            <div className='messages-search__pointer-arrows'>
              <button type='button' className="className='messages-search__pointer-arrow messages-search__pointer-arrow--top">
                <ArrowSvg viewBox='0 0 8 14' />
              </button>

              <button type='button' className="className='messages-search__pointer-arrow messages-search__pointer-arrow--bottom">
                <ArrowSvg viewBox='0 0 8 14' />
              </button>
            </div>
          </div>
        </>
      ) : (
        <button type='button' onClick={changeSearchingState} className='chat-data__button'>
          <SearchSvg />
        </button>
      )}
    </div>
  );
};
