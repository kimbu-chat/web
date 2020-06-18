import React from 'react';

import './SearchTop.scss';

const SearchTop = () => {
  return (
    <div className="messenger__search-top">
      <button className="messenger__burger">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" e-dvz7b7="">
          <path
            fill-rule="nonzero"
            d="M19 16a1 1 0 010 2H5a1 1 0 010-2zM5 11h14a1 1 0 01.12 1.99H5A1 1 0 014.88 11H19zM5 6h14a1 1 0 01.12 2H5a1 1 0 01-.12-2H19z"
            e-dvz7b7=""
          ></path>
        </svg>
      </button>
      <div className="messenger__search">
        <div className="">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" e-dvz7b7="">
            <path
              fill-rule="evenodd"
              d="M6.98 1.2a5.79 5.79 0 0 1 4.72 9.13l2.96 2.96a1 1 0 0 1-1.41 1.42l-2.97-2.97A5.79 5.79 0 1 1 6.98 1.2zm0 1.6A4.19 4.19 0 1 0 7 11.18a4.19 4.19 0 0 0 0-8.38z"
              clip-rule="evenodd"
              e-dvz7b7=""
            ></path>
          </svg>
        </div>
        <input type="text" placeholder="Search" />
      </div>
      <button className="messenger__create-chat">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" e-dvz7b7="">
          <path
            fill-rule="evenodd"
            d="M17.05 3.759a2.278 2.278 0 013.223 3.222l-7.088 7.089a.8.8 0 01-.319.195l-1.55.504-.616.2a1.3 1.3 0 01-1.638-1.638l.2-.616.505-1.55a.8.8 0 01.195-.318l7.088-7.088zm-6.284 9.507l.056-.018 1.367-.445 5.077-5.078-.96-.96-5.077 5.078-.445 1.367-.018.056zm6.601-7.561l.96.96.815-.815a.678.678 0 000-.959h-.001a.678.678 0 00-.96 0l-.814.814zm-4.805-.498H6.994a2.8 2.8 0 00-2.8 2.8v8.98a2.8 2.8 0 002.8 2.8h9.008a2.8 2.8 0 002.8-2.8v-5.543l-1.6 1.6v3.944a1.2 1.2 0 01-1.2 1.2H6.994a1.2 1.2 0 01-1.2-1.2v-8.98a1.2 1.2 0 011.2-1.2h3.968l1.6-1.6z"
            clip-rule="evenodd"
            e-dvz7b7=""
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default SearchTop;
