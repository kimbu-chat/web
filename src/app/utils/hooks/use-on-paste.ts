import { useEffect } from 'react';

export default function useOnPaste(ref: React.RefObject<HTMLElement>, callback: (event: ClipboardEvent) => void) {
	useEffect(() => {
		ref.current?.addEventListener('paste', callback);

		return () => {
			ref.current?.removeEventListener('paste', callback);
		};
	}, [ref, callback]);
}
