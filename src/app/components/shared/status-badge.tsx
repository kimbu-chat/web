import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import Avatar from '@material-ui/core/Avatar/Avatar';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { UserPreview } from 'app/store/my-profile/models';
import { UserStatus } from 'app/store/friends/models';

const OnlineBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: '$ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""',
		},
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0,
		},
	},
}))(Badge);

const OfflineBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: '#b70015',
		color: '#b70015',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
	},
}))(Badge);

namespace StatusBadge {
	export interface Props {
		user: UserPreview;
		additionalClassNames?: string;
	}
}

const StatusBadge = ({ user, additionalClassNames }: StatusBadge.Props) => {
	if (user?.status === UserStatus.Online) {
		return (
			<OnlineBadge
				overlap='circle'
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				variant='dot'
			>
				<Avatar className={additionalClassNames} src={user.avatarUrl}>
					{getUserInitials(user)}
				</Avatar>
			</OnlineBadge>
		);
	} else {
		return (
			<OfflineBadge
				overlap='circle'
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				variant='dot'
			>
				<Avatar className={additionalClassNames} src={user?.avatarUrl}>
					{getUserInitials(user)}
				</Avatar>
			</OfflineBadge>
		);
	}
};

export default StatusBadge;
