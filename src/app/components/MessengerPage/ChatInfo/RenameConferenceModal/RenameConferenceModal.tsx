import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './_RenameConferenceModal.scss';

namespace RenameConferenceModal {
  export interface Props {
    close: () => void;
    renameConference: (newName: string) => void;
  }
}

const RenameConferenceModal = React.forwardRef(
  ({ close, renameConference }: RenameConferenceModal.Props, ref: React.Ref<HTMLDivElement>) => {
    const [newName, setNewName] = useState('');

    const submitRename = () => {
      renameConference(newName);
      close();
    };

    const submitRenameByKey = (event: any) => {
      if (event.key === 'Enter') {
        submitRename();
      }
    };
    return (
      <div ref={ref} className="rename-conference">
        <TextField
          onKeyPress={submitRenameByKey}
          onChange={(e) => setNewName(e.target.value)}
          id="standard-basic"
          label="Новое название"
        />
        <div className="flat rename-conference__btn-group">
          <Button onClick={submitRename} color="primary">
            Переименовать
          </Button>
          <Button onClick={close} color="secondary">
            Отмена
          </Button>
        </div>
      </div>
    );
  }
);

export default RenameConferenceModal;
