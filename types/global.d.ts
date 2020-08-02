/** Global definitions for development **/

// for style loader
declare module '*.css' {
	const styles: any;
	export = styles;
}

declare module '*.ogg' {
	const music: any;
	export = music;
}

// Omit type https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;
