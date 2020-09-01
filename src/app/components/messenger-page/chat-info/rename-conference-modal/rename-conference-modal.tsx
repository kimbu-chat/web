import React, { useState, useContext } from 'react';
import './rename-conference-modal.scss';

import { LocalizationContext } from 'app/app';
import ReactDOM from 'react-dom';

namespace RenameConferenceModal {
	export interface Props {
		close: () => void;
		renameConference: (newName: string) => void;
	}
}

const RenameConferenceModal = React.forwardRef(
	({ close, renameConference }: RenameConferenceModal.Props, ref: React.Ref<HTMLDivElement>) => {
		const { t } = useContext(LocalizationContext);
		const [newName, setNewName] = useState('');

		const submitRename = () => {
			renameConference(newName);
			close();
		};

		const submitRenameByKey = (event: React.KeyboardEvent) => {
			if (event.key === 'Enter') {
				submitRename();
			}
		};
		return (
			<div ref={ref} className='rename-conference'>
				<input
					onKeyPress={submitRenameByKey}
					onChange={(e) => setNewName(e.target.value)}
					id='standard-basic'
					placeholder={t('renameConference.newName')}
				/>
				<div className='flat rename-conference__btn-group'>
					<button onClick={submitRename} color='primary'>
						{t('renameConference.rename')}
					</button>
					<button onClick={close} color='secondary'>
						{t('renameConference.reject')}
					</button>
				</div>
			</div>
		);
	},
);

const RenameConferenceModalPortal = (props: RenameConferenceModal.Props) => {
	return ReactDOM.createPortal(
		<RenameConferenceModal {...props} />,
		document.getElementById('root') || document.createElement('div'),
	);
};

export default React.memo(RenameConferenceModalPortal);
