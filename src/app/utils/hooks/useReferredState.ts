import { useRef, useState, useEffect } from 'react';

export default function useReferredState<T>(initialValue: T) {
	const [state, setState] = useState<T>(initialValue);
	const reference = useRef<T>(state);

	useEffect(() => {
		reference.current = state;
	}, [state]);

	return { reference, state, setState };
}
