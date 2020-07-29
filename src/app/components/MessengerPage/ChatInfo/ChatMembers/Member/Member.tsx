import React from 'react';
import './_Member.scss';
import { UserPreview } from 'app/store/my-profile/models';
import moment from 'moment';
import StatusBadge from 'app/utils/StatusBadge';

namespace Member {
  export interface Props {
    member: UserPreview;
  }
}

const Member = ({ member }: Member.Props) => {
  return (
    <div className="chat-members__member">
      <StatusBadge user={member} />
      <div className="chat-members__data">
        <h3>{`${member?.firstName} ${member?.lastName}`}</h3>
        <span>{member?.status === 1 ? 'Online' : moment.utc(member?.lastOnlineTime).startOf('hour').fromNow()}</span>
      </div>
    </div>
  );
};

export default Member;
