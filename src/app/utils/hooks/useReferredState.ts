import { useRef, useState } from 'react';

export default function useReferredState<T>(initialValue: T) {
	const [state, setState] = useState<T>(initialValue);
	const reference = useRef<T>(state);

	const setReferredState = (value: T) => {
		reference.current = value;
		setState(value);
	};

	return [reference, state, setReferredState];
}
