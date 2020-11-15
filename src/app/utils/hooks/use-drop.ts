import { useEffect, useRef } from 'react';

export function useDrop(listeners: {
	onDrag?: (ev: DragEvent) => void;
	onDragOver?: (ev: DragEvent) => void;
	onDragEnter?: (ev: DragEvent) => void;
	onDragLeave?: (ev: DragEvent) => void;
	onDrop?: (ev: DragEvent) => void;
}) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (listeners.onDrag) {
			ref.current?.addEventListener('drag', listeners.onDrag);
		}

		if (listeners.onDragOver) {
			ref.current?.addEventListener('dragover', listeners.onDragOver);
		}

		if (listeners.onDragEnter) {
			ref.current?.addEventListener('dragenter', listeners.onDragEnter);
		}

		if (listeners.onDragLeave) {
			ref.current?.addEventListener('dragleave', listeners.onDragLeave);
		}

		if (listeners.onDrop) {
			ref.current?.addEventListener('drop', listeners.onDrop);
		}

		return () => {
			if (listeners.onDrag) {
				ref.current?.removeEventListener('drag', listeners.onDrag);
			}

			if (listeners.onDragOver) {
				ref.current?.removeEventListener('dragover', listeners.onDragOver);
			}

			if (listeners.onDragEnter) {
				ref.current?.removeEventListener('dragenter', listeners.onDragEnter);
			}

			if (listeners.onDragLeave) {
				ref.current?.removeEventListener('dragleave', listeners.onDragLeave);
			}

			if (listeners.onDrop) {
				ref.current?.removeEventListener('drop', listeners.onDrop);
			}
		};
	}, [ref, listeners.onDrag, listeners.onDragEnter, listeners.onDragLeave]);

	return ref;
}

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
