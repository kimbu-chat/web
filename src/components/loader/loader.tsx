import React from 'react';

import classnames from 'classnames';

import './loader.scss';

const BLOCK_NAME = 'loader';

export enum LoaderSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export type LoaderProps = {
  className?: string;
  size?: LoaderSize;
};

export const Loader: React.FC<LoaderProps> = ({ className, size = LoaderSize.SMALL }) => {
  const partClassName = classnames(`${BLOCK_NAME}__div`, `${BLOCK_NAME}__div--${size}`);
  return (
    <div className={classnames(BLOCK_NAME, `${BLOCK_NAME}--${size}`, className)}>
      <div className={partClassName} />
      <div className={partClassName} />
      <div className={partClassName} />
      <div className={partClassName} />
    </div>
  );
};
