import moment from 'moment';

export const setSeparators = <T extends { creationDateTime?: Date; needToShowSeparator?: boolean }>(
	elements: T[],
	separateBy: 'day' | 'month' | 'year',
	separateFirst?: boolean,
) => {
	return elements.map((elem, index, array) => {
		const elemCopy = { ...elem };

		if (index === 0 && separateFirst) {
			elemCopy.needToShowSeparator = true;
		}

		const currentDate = new Date(moment.utc(elem?.creationDateTime!).local().toDate());
		const prevDate = new Date(
			moment
				.utc(array[index - 1]?.creationDateTime!)
				.local()
				.toDate(),
		);

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

		if (!condition) {
			elemCopy.needToShowSeparator = true;
		}
		return elemCopy;
	});
};
