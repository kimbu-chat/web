export const getRawAttachmentsizeUnit = (byteSize: number) => {
	return byteSize > 1048576
		? `${(byteSize / 1048576).toFixed(2)} Mb`
		: byteSize > 1024
		? `${(byteSize / 1024).toFixed(2)} Kb`
		: `${byteSize.toFixed(2)} bytes`;
};
