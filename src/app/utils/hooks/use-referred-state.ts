import { useRef, useEffect } from 'react';

export default function useReferState<T>(stateValue: T) {
	const reference = useRef<T>(stateValue);

	useEffect(() => {
		reference.current = stateValue;
	}, [stateValue]);

	return reference;
}
