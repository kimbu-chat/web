/** Global definitions for development * */

// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

declare module '*.ogg' {
  const music: any;
  export = music;
}

declare module '*.wav' {
  const music: any;
  export = music;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

// Omit type https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;
