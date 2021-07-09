import React from 'react';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactComponent as SearchSvg } from '@icons/search.svg';

import './search-box.scss';

interface ISearchBoxProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
}

const BLOCK_NAME = 'search-box';

export const SearchBox: React.FC<ISearchBoxProps> = ({
  onChange,
  iconClassName,
  inputClassName,
  containerClassName,
}) => {
  const { t } = useTranslation();
  return (
    <div className={classnames(`${BLOCK_NAME}__input-wrapper`, containerClassName)}>
      <input
        onChange={onChange}
        placeholder={t('chatActions.search')}
        type="text"
        className={classnames(`${BLOCK_NAME}__input`, inputClassName)}
      />
      <SearchSvg
        viewBox="0 0 24 24"
        className={classnames(`${BLOCK_NAME}__input__svg`, iconClassName)}
      />
    </div>
  );
};
