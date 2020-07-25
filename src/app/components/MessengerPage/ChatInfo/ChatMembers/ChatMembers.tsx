import React, { useState, useEffect } from 'react';
import Member from './Member/Member';
import { useSelector } from 'react-redux';
import './_ChatMembers.scss';
import { AppState } from 'app/store';
import { UserPreview } from 'app/store/contacts/types';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getConferenceUsersAction } from 'app/store/conferences/actions';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { Dialog } from 'app/store/dialogs/types';

namespace ChatMembers {
  export interface Props {
    addMembers: (params: object) => void;
  }
}

const ChatMembers = ({ addMembers }: ChatMembers.Props) => {
  const [membersDisplayed, setMembersDisplayed] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState<string>('');

  const getConferenceUsers = useActionWithDispatch(getConferenceUsersAction);
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;

  const membersForConference = useSelector<AppState, (UserPreview | undefined)[]>(
    (state) => state.friends.usersForSelectedConference
  );

  const membersIdsForConference: (number | undefined)[] = membersForConference.map((user) => user?.id);

  useEffect(() => {
    getConferenceUsers({
      conferenceId: selectedDialog.conference?.id || -1,
      initiatedByScrolling: false,
      page: { offset: 0, limit: 15 }
    });
    return () => {
      setSearchStr('');
      setMembersDisplayed(false);
    };
  }, [selectedDialog.id]);

  const loadMore = () => {
    getConferenceUsers({
      conferenceId: selectedDialog.conference?.id || -1,
      initiatedByScrolling: true,
      page: { offset: membersForConference.length, limit: 15 },
      filters: {
        name: searchStr
      }
    });
  };

  return (
    <React.Fragment>
      <button onClick={() => setMembersDisplayed(!membersDisplayed)} className="chat-members__func-btn">
        <span>Участники</span>
        <div className={membersDisplayed ? 'svg svg--rotated' : 'svg'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M5.363 12.318a.9.9 0 1 0 1.274 1.272l4.995-5.007a.9.9 0 0 0 0-1.272L6.696 2.364a.9.9 0 1 0-1.274 1.272l4.302 4.311-4.361 4.371z" />
          </svg>
        </div>
      </button>
      {membersDisplayed && (
        <React.Fragment>
          <input
            onChange={(e) => {
              setSearchStr(e.target.value);
              getConferenceUsers({
                conferenceId: selectedDialog.conference?.id || -1,
                initiatedByScrolling: false,
                page: { offset: 0, limit: 15 },
                filters: {
                  name: e.target.value
                }
              });
            }}
            type="text"
            placeholder="Поиск"
            className="chat-members__search"
          />
          <div className="chat-members__members-list">
            <div
              onClick={() => addMembers({ excludeIds: membersIdsForConference })}
              className="chat-members__add-member"
            >
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M7.2 7.2V2.682a.8.8 0 0 1 1.6 0V7.2h4.518a.8.8 0 0 1 0 1.6H8.8v4.518a.8.8 0 0 1-1.6 0V8.8H2.682a.8.8 0 0 1 0-1.6H7.2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Добавить участников</span>
            </div>
            {membersForConference.map((member) => (
              <Member member={member} key={member?.id} />
            ))}
            <div onClick={loadMore} className="chat-members__load-more">
              <span>Показать еще</span>
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M5.363 12.318a.9.9 0 1 0 1.274 1.272l4.995-5.007a.9.9 0 0 0 0-1.272L6.696 2.364a.9.9 0 1 0-1.274 1.272l4.302 4.311-4.361 4.371z" />
                </svg>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ChatMembers;
