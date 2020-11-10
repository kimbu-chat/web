export const setSeparators = <T extends { creationDateTime?: Date; needToShowSeparator?: boolean }>(
	elements: T[],
	separateBy: 'day' | 'month' | 'year',
) => {
	return elements.map((elem, index, array) => {
		const elemCopy = { ...elem };

		const currentDate = new Date(elem?.creationDateTime!);
		const prevDate = new Date(array[index - 1]?.creationDateTime!);

		const condition =
			separateBy === 'day'
				? `${prevDate.getDate()} ${prevDate.getMonth()} ${prevDate.getFullYear()}` ===
				  `${currentDate.getDate()} ${currentDate.getMonth()} ${currentDate.getFullYear()}`
				: separateBy === 'month'
				? `${prevDate.getMonth()} ${prevDate.getFullYear()}` ===
				  `${currentDate.getMonth()} ${currentDate.getFullYear()}`
				: separateBy === 'year'
				? `${prevDate.getFullYear()}` === `${currentDate.getFullYear()}`
				: false;

		if (condition) {
			elemCopy.needToShowSeparator = true;
		}
		return elemCopy;
	});
};
