import { IGroupable } from 'app/store/chats/models';
import moment from 'moment';

export const setSeparators = <T extends IGroupable>(
	elements: T[],
	separateBy: {
		separateByDate?: boolean;
		separateByMonth?: boolean;
		separateByYear?: boolean;
	},
	separateFirst?: {
		separateByDate?: boolean;
		separateByMonth?: boolean;
		separateByYear?: boolean;
	},
) => {
	return elements.map((elem, index, array) => {
		const elemCopy = { ...elem };

		if (index === 0 && separateFirst) {
			if (separateFirst.separateByDate) {
				elemCopy.needToShowDateSeparator = true;
			}

			if (separateFirst.separateByMonth) {
				elemCopy.needToShowMonthSeparator = true;
			}

			if (separateFirst.separateByYear) {
				elemCopy.needToShowYearSeparator = true;
			}
		}

		const currentDate = new Date(moment.utc(elem?.creationDateTime!).local().toDate());
		const prevDate = moment
			.utc(array[index - 1]?.creationDateTime!)
			.local()
			.toDate();
		if (separateBy.separateByDate && prevDate.toDateString() === currentDate.toDateString()) {
			elemCopy.needToShowDateSeparator = true;
		}

		if (
			separateBy.separateByMonth &&
			`${prevDate.getMonth()} ${prevDate.getFullYear()}` !==
				`${currentDate.getMonth()} ${currentDate.getFullYear()}`
		) {
			elemCopy.needToShowMonthSeparator = true;
		}

		if (separateBy.separateByYear && prevDate.getFullYear() !== currentDate.getFullYear()) {
			elemCopy.needToShowYearSeparator = true;
		}
		return elemCopy;
	});
};

export const doesYearDifferFromCurrent = (date: Date) => {
	return new Date().getFullYear() !== new Date(date).getFullYear();
};
