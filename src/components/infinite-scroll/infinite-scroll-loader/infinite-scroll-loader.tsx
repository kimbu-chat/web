import React from 'react';
import './infinite-scroll-loader.scss';

const InfiniteScrollLoader = () => (
  <div className="infinite-loader">
    <div className="">
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>
);

InfiniteScrollLoader.displayName = 'InfiniteScrollLoader';

export { InfiniteScrollLoader };
