import React from 'react';
import { Avatar } from '@material-ui/core';
import { AppState } from 'app/store';
import { useSelector } from 'react-redux';
import './_AccountInfo.scss';

namespace AccountInfo {
  export interface Props {
    hideSlider: () => void;
    displayCreateChat: () => void;
  }
}

const getInitials = (nameSurname: string): string => {
  const initials = nameSurname
    .split(' ')
    .reduce((accum, current) => {
      return accum + current[0];
    }, '')
    .split('')
    .join(' ');

  const shortedInitials = initials.substr(0, 3);

  return shortedInitials;
};

const AccountInfo = React.forwardRef(
  ({ hideSlider, displayCreateChat }: AccountInfo.Props, ref: React.Ref<HTMLDivElement>) => {
    const firstName = useSelector<AppState, string>((state) => state.auth.currentUser?.firstName || '');
    const lastName = useSelector<AppState, string>((state) => state.auth.currentUser?.lastName || '');
    const avatar = useSelector<AppState, string>((state) => state.auth.currentUser?.avatarUrl || '');

    const createChat = () => {
      hideSlider();
      displayCreateChat();
    };

    return (
      <div ref={ref} className="messenger__account-info">
        <button onClick={() => hideSlider()} className="messenger__hide-info">
          <div className="svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M10.634 3.634a.9.9 0 1 0-1.278-1.268l-4.995 5.03a.9.9 0 0 0 0 1.268l4.936 4.97a.9.9 0 0 0 1.278-1.268L6.268 8.03l4.366-4.396z"></path>
            </svg>
          </div>
        </button>
        <div className="messenger__account-avatar">
          <Avatar className="messenger__account-avatar-img" alt={name} src={avatar}>
            {getInitials(`${firstName} ${lastName}`)}
          </Avatar>
          <div className="messenger__change-photo">
            <div className="messenger__change-photo__svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M15.157 3.916a2.138 2.138 0 0 0-.001-3.017 2.137 2.137 0 0 0-3.02-.002l-2.65 2.649v.001l-2.47 2.47-1.123 1.122a.8.8 0 0 0-.196.324l-.138.432-.302.952-.147.464a1.299 1.299 0 0 0 1.632 1.632l.464-.147.952-.303.432-.137a.8.8 0 0 0 .324-.197l1.122-1.122 2.47-2.47v-.001l2.65-2.649v-.001zm-3.782 1.518v.002l-2.47 2.47-.985.984-.246.078-.864.275.274-.864.078-.246.985-.985 2.47-2.47.53-.53a.886.886 0 0 0 .082.097l.495.503.161.164a.293.293 0 0 0 .006.007l-.516.515zm1.767-1.766l-.495-.504-.155-.159a.89.89 0 0 0-.108-.094l.883-.883a.536.536 0 0 1 .757.758l-.882.882zm1.665 3.614v4.716a2.8 2.8 0 0 1-2.8 2.8H3.991a2.8 2.8 0 0 1-2.8-2.8V3.985a2.8 2.8 0 0 1 2.8-2.8h4.841l-1.6 1.6H3.991a1.2 1.2 0 0 0-1.2 1.2v8.013a1.2 1.2 0 0 0 1.2 1.2h8.016a1.2 1.2 0 0 0 1.2-1.2V8.882l1.6-1.6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
          <h1>{`${firstName} ${lastName}`}</h1>
        </div>
        <div className="messenger__account-info__btn-groups">
          <div className="messenger__account-info__btn-group">
            <button className="messenger__account-info__btn" onClick={() => createChat()}>
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M15.157 3.916a2.138 2.138 0 0 0-.001-3.017 2.137 2.137 0 0 0-3.02-.002l-2.65 2.649v.001l-2.47 2.47-1.123 1.122a.8.8 0 0 0-.196.324l-.138.432-.302.952-.147.464a1.299 1.299 0 0 0 1.632 1.632l.464-.147.952-.303.432-.137a.8.8 0 0 0 .324-.197l1.122-1.122 2.47-2.47v-.001l2.65-2.649v-.001zm-3.782 1.518v.002l-2.47 2.47-.985.984-.246.078-.864.275.274-.864.078-.246.985-.985 2.47-2.47.53-.53a.886.886 0 0 0 .082.097l.495.503.161.164a.293.293 0 0 0 .006.007l-.516.515zm1.767-1.766l-.495-.504-.155-.159a.89.89 0 0 0-.108-.094l.883-.883a.536.536 0 0 1 .757.758l-.882.882zm1.665 3.614v4.716a2.8 2.8 0 0 1-2.8 2.8H3.991a2.8 2.8 0 0 1-2.8-2.8V3.985a2.8 2.8 0 0 1 2.8-2.8h4.841l-1.6 1.6H3.991a1.2 1.2 0 0 0-1.2 1.2v8.013a1.2 1.2 0 0 0 1.2 1.2h8.016a1.2 1.2 0 0 0 1.2-1.2V8.882l1.6-1.6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span>Создать чат</span>
            </button>
            <button className="messenger__account-info__btn">
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M13.792 2.751a1.536 1.536 0 00-2.418-1.256l-.86.602-1.593 1.117H3.717C1.768 3.219.22 4.924.22 6.987c0 1.839 1.229 3.393 2.876 3.713l.157.595.923 3.496a1.3 1.3 0 001.256.968h1.062a1.3 1.3 0 001.282-1.522l-.579-3.284-.034-.192h1.73l1.622 1.136.86.603a1.534 1.534 0 002.417-1.257V2.751zm-5.637 6.41V4.814H3.719c-1.03.003-1.899.96-1.899 2.173s.87 2.171 1.899 2.174h4.436zm4.037 1.957l-.759-.532-1.678-1.175V4.583l1.678-1.175.759-.532v8.242zM4.8 10.887l-.034-.126h.773l.082.468.516 2.93h-.474L4.8 10.887z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span>Создать канал</span>
            </button>
            <button className="messenger__account-info__btn">
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M8.53 9.94l.36-.18a1.8 1.8 0 012.35.72l.44.75.4.72a1.8 1.8 0 01-.62 2.44l-1.02.61c-1.92 1.17-5.36-.31-7.84-4.6C.12 6.1.53 2.42 2.54 1.31c.16-.08.5-.3.96-.57A1.8 1.8 0 016 1.38l.38.67.44.75a1.8 1.8 0 01-.56 2.4l-.96.64a10.7 10.7 0 002.56 4.44l.68-.34zm2.1 3.08a.2.2 0 00.07-.27l-.4-.72-.44-.75a.2.2 0 00-.26-.08l-.36.17-.9.44a1.3 1.3 0 01-1.47-.24 12.3 12.3 0 01-3.2-5.54 1.3 1.3 0 01.54-1.4l1.15-.77a.2.2 0 00.06-.26L5 2.85l-.39-.67a.2.2 0 00-.27-.08c-.47.3-.83.51-1.02.62-.3.17-.69.82-.79 1.73C2.37 5.8 2.8 7.55 4 9.6c1.18 2.06 2.48 3.3 3.75 3.84.84.36 1.6.36 1.87.2l1.02-.62zm1.15-6.95V4.8h1.25a.8.8 0 000-1.6h-1.25V1.96a.8.8 0 00-1.6 0v1.25H8.92a.8.8 0 100 1.6h1.26v1.26a.8.8 0 001.6 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span>Создать звонок</span>
            </button>
          </div>
          <div className="messenger__account-info__btn-group">
            <button className="messenger__account-info__btn">
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M13.23 6.77L8.61 2.5 3.78 6.8A.8.8 0 0 1 3.8 7v6c0 .11.09.2.2.2h2.2V9.5a1.3 1.3 0 0 1 1.3-1.3h2a1.3 1.3 0 0 1 1.3 1.3v3.7H13a.2.2 0 0 0 .2-.2V7a.8.8 0 0 1 .03-.23zm1.57 1.45A.8.8 0 0 0 15.83 7L9.16.83A.8.8 0 0 0 8.08.82l-6.9 6.17A.8.8 0 0 0 2.2 8.22V13c0 1 .8 1.8 1.8 1.8h9c1 0 1.8-.8 1.8-1.8V8.22zM9.2 13.2H7.8V9.8h1.4v3.4z"
                  ></path>
                </svg>
              </div>
              <span>На главную</span>
            </button>
            <button className="messenger__account-info__btn">
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M8 15.35A7.33 7.33 0 118.03.68 7.33 7.33 0 018 15.35zm4.52-3.8a5.73 5.73 0 10-9.03-.01 7.98 7.98 0 014.5-1.5c1.63-.02 3.33.59 4.53 1.5zm-1.17 1.12A6.1 6.1 0 008 11.64c-1.18 0-2.45.43-3.35 1.02a5.7 5.7 0 006.69.01zm-.64-6.16a2.71 2.71 0 10-5.42 0 2.71 2.71 0 005.42 0zm-3.82 0a1.11 1.11 0 112.22 0 1.11 1.11 0 01-2.22 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span>Контакты</span>
            </button>
            <button className="messenger__account-info__btn">
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M6.02 1.55A1.5 1.5 0 0 1 7.52.2h.96c.77 0 1.42.58 1.5 1.35l.03.31c.31.1.61.23.9.38l.25-.2a1.5 1.5 0 0 1 2.01.1l.69.68c.54.55.59 1.41.1 2.01l-.2.25c.14.28.26.57.36.86l.33.04a1.5 1.5 0 0 1 1.36 1.49v.97a1.5 1.5 0 0 1-1.35 1.5l-.31.02c-.1.31-.22.62-.37.9l.22.27c.48.6.44 1.46-.1 2.01l-.34.34-.35.35a1.5 1.5 0 0 1-2 .1l-.25-.2c-.3.16-.61.29-.93.4l-.03.32a1.5 1.5 0 0 1-1.5 1.35h-.97a1.5 1.5 0 0 1-1.49-1.35l-.03-.32a6.4 6.4 0 0 1-.9-.37l-.26.2a1.5 1.5 0 0 1-2.01-.1 175.39 175.39 0 0 0-.68-.68 1.5 1.5 0 0 1-.1-2l.2-.25c-.17-.3-.3-.63-.4-.96l-.3-.03A1.5 1.5 0 0 1 .2 8.44v-.96c0-.77.59-1.41 1.35-1.5l.33-.03c.1-.3.23-.61.38-.9l-.19-.24a1.5 1.5 0 0 1 .1-2l.69-.7a1.5 1.5 0 0 1 2-.1l.26.21c.28-.14.57-.26.87-.36l.03-.3zm1.59.25l-.08.77a.8.8 0 0 1-.62.7c-.52.12-1 .32-1.45.6a.8.8 0 0 1-.93-.06l-.6-.5-.56.56.48.59a.8.8 0 0 1 .05.94c-.29.45-.5.95-.62 1.48a.8.8 0 0 1-.7.61l-.78.08v.79l.76.07a.8.8 0 0 1 .7.63c.12.54.34 1.05.63 1.52a.8.8 0 0 1-.05.94l-.49.6a345.7 345.7 0 0 0 .56.55l.6-.5a.8.8 0 0 1 .93-.05c.46.28.96.49 1.48.6a.8.8 0 0 1 .62.7l.08.78h.8l.07-.78a.8.8 0 0 1 .62-.7 4.76 4.76 0 0 0 1.5-.63.8.8 0 0 1 .93.05l.6.5.28-.29.28-.28-.5-.6a.8.8 0 0 1-.06-.93c.28-.46.48-.96.6-1.49a.8.8 0 0 1 .7-.62l.77-.08v-.79l-.79-.08a.8.8 0 0 1-.7-.61c-.12-.51-.32-1-.6-1.44a.8.8 0 0 1 .05-.94l.5-.6-.56-.56-.6.5a.8.8 0 0 1-.94.05 4.8 4.8 0 0 0-1.48-.61.8.8 0 0 1-.62-.7L8.4 1.8h-.78zM8 5.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zm0 1.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span>Настройки</span>
            </button>
          </div>
          <button className="messenger__account-info__btn-group">
            <div className="messenger__account-info__btn">
              <div className="svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M14.8 4A2.8 2.8 0 0 0 12 1.2H4A2.8 2.8 0 0 0 1.2 4v1.02h1.6V4c0-.66.53-1.2 1.2-1.2h8c.67 0 1.2.54 1.2 1.2v8.01c0 .67-.53 1.2-1.2 1.2H4a1.2 1.2 0 0 1-1.2-1.2V11H1.2V12a2.8 2.8 0 0 0 2.8 2.8h8a2.8 2.8 0 0 0 2.8-2.8v-8zM7.69 10.2a.8.8 0 0 0 1.13 1.13l2.73-2.73a.8.8 0 0 0-.15-1.28L8.8 4.73a.8.8 0 1 0-1.13 1.13L9.02 7.2H1a.8.8 0 1 0 0 1.6h8.06L7.68 10.2z"
                  ></path>
                </svg>
              </div>
              <span>Выход</span>
            </div>
            <span>Настройки</span>
          </button>
        </div>
        <button className="messenger__account-info__btn-group">
          <div className="messenger__account-info__btn">
            <div className="svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M14.8 4A2.8 2.8 0 0 0 12 1.2H4A2.8 2.8 0 0 0 1.2 4v1.02h1.6V4c0-.66.53-1.2 1.2-1.2h8c.67 0 1.2.54 1.2 1.2v8.01c0 .67-.53 1.2-1.2 1.2H4a1.2 1.2 0 0 1-1.2-1.2V11H1.2V12a2.8 2.8 0 0 0 2.8 2.8h8a2.8 2.8 0 0 0 2.8-2.8v-8zM7.69 10.2a.8.8 0 0 0 1.13 1.13l2.73-2.73a.8.8 0 0 0-.15-1.28L8.8 4.73a.8.8 0 1 0-1.13 1.13L9.02 7.2H1a.8.8 0 1 0 0 1.6h8.06L7.68 10.2z"
                ></path>
              </svg>
            </div>
            <span>Выход</span>
          </div>
        </button>
      </div>
    </div>
  );
});

export default AccountInfo;
