let currentMusic: HTMLAudioElement;
let currentChangePlayStatus: React.Dispatch<React.SetStateAction<boolean>> | undefined;

export const changeMusic = (
	newMusic: HTMLAudioElement,
	changePlayStatus?: React.Dispatch<React.SetStateAction<boolean>>,
	needsToBePaused?: boolean,
) => {
	if (newMusic !== currentMusic) {
		newMusic.play();

		if (currentMusic) {
			currentMusic.pause();
		}
	} else {
		if (newMusic.paused) {
			newMusic.play();
		} else {
			if (needsToBePaused) {
				newMusic.pause();
			}
		}
	}

	if (currentChangePlayStatus) currentChangePlayStatus(false);

	currentMusic = newMusic;

	if (changePlayStatus) {
		currentChangePlayStatus = changePlayStatus;
	}

	if (changePlayStatus) changePlayStatus(!currentMusic.paused);
};
