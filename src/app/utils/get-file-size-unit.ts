export const getFileSizeUnit = (byteSize: number) => {
	return byteSize > 1000000
		? `${(byteSize / 1000000).toFixed(2)} Mb`
		: byteSize > 1000
		? `${(byteSize / 1000).toFixed(2)} Kb`
		: `${byteSize.toFixed(2)} bytes`;
};
