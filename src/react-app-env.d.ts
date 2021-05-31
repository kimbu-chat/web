/// <reference types="react-scripts" />

declare module '*.ogg' {
  const src: string;
  export default src;
}

interface Window {
  __config: {
    REACT_APP_MAIN_API: string;
    REACT_APP_NOTIFICATIONS_API: string;
    REACT_APP_FILES_API: string;
    REACT_APP_WEBSOCKET_API: string;
  };
}
