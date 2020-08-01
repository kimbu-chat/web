export interface Page {
	limit: number;
	offset: number;
}

export interface UpdateAvatarResponse {
	fullAvatarUrl: string;
	croppedAvatarUrl: string;
}
