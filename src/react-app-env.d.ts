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

interface Window {
  __config: {
    REACT_APP_MAIN_API: string;
    REACT_APP_NOTIFICATIONS_API: string;
    REACT_APP_FILES_API: string;
  };
}
