import React from 'react';
import { i18n, TFunction } from 'i18next';

export interface ILocalizationContextProps {
  t: TFunction;
  i18n?: i18n;
}

export const LocalizationContext = React.createContext<ILocalizationContextProps>({ t: (str: string) => str });
