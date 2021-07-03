import React from 'react';

import classnames from 'classnames';

import './loader.scss';

const BLOCK_NAME = 'loader';

type LoaderProps = {
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({ className }) => (
  <div className={classnames(BLOCK_NAME, className)}>
    <div />
    <div />
    <div />
    <div />
  </div>
);
