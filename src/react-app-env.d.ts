/// <reference types="react-scripts" />

declare module '*.ogg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const content: string;

  export { ReactComponent };
  export default content;
}
