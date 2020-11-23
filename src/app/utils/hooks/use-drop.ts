import { useEffect } from 'react';

export function useGlobalDrop(listeners: {
	onDrag?: (ev: DragEvent) => void;
	onDragOver?: (ev: DragEvent) => void;
	onDragEnter?: (ev: DragEvent) => void;
	onDragLeave?: (ev: DragEvent) => void;
	onDrop?: (ev: DragEvent) => void;
}) {
	useEffect(() => {
		if (listeners.onDrag) {
			document.addEventListener('drag', listeners.onDrag);
		}

		if (listeners.onDragOver) {
			document.addEventListener('dragover', listeners.onDragOver);
		}

		if (listeners.onDragEnter) {
			document.addEventListener('dragenter', listeners.onDragEnter);
		}

		if (listeners.onDragLeave) {
			document.addEventListener('dragleave', listeners.onDragLeave);
		}

		if (listeners.onDrop) {
			document.addEventListener('drop', listeners.onDrop);
		}

		return () => {
			if (listeners.onDrag) {
				document.removeEventListener('drag', listeners.onDrag);
			}

			if (listeners.onDragOver) {
				document.removeEventListener('dragover', listeners.onDragOver);
			}

			if (listeners.onDragEnter) {
				document.removeEventListener('dragenter', listeners.onDragEnter);
			}

			if (listeners.onDragLeave) {
				document.removeEventListener('dragleave', listeners.onDragLeave);
			}

			if (listeners.onDrop) {
				document.removeEventListener('drop', listeners.onDrop);
			}
		};
	}, [listeners.onDrag, listeners.onDragEnter, listeners.onDragLeave]);
}
