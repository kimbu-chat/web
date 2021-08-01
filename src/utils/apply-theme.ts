import { Theme } from '@store/settings/features/models/theme';

export function applyTheme(theme?: Theme) {
  const lightThemeColors: {
    [key: string]: string;
  } = {
    '--dt-grafit-wt-kingBlue': '#3F8AE0',
    '--dt-grafit-wt-white': '#fff',
    '--dt-grafit-wt-kingBlueLight-transparent': 'rgba(63, 138, 224, 0.25)',

    '--dt-dark-wt-white': '#fff',
    '--dt-dark-wt-bright-blue': '#D6E9FF',
    '--dt-dark-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
    '--dt-dark-transparent-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
    '--dt-semi-transparent-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
    '--dt-gray-transparent-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
    '--dt-gray-semi-transparent-wt-kingBlueLight-transparentest': 'rgba(214, 233, 255, 0.69)',
    '--dt-dark-wt-kingBlue': '#3F8AE0',
    '--dt-dark-wt-whiter': 'rgba(214, 233, 255, 0.2)',
    '--dt-dark-wt-kingBlue-lighter': '#E8F1FB',
    '--dt-dark-wt-pink': '#FCE4E3',

    '--dt-kingBlue-transparentest-wt-grayLight': 'rgba(63, 138, 224, 0.12)',

    '--dt-dark-transparent-wt-kingBlueLight-transparent': 'rgba(63, 138, 224, 0.25)',

    '--upload-photo-progress': 'rgba(63, 138, 224, 0.55)',

    '--dt-white-wt-dark': '#4A5466',
    '--dt-white-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
    '--dt-white-wt-kingBlue': '#3F8AE0',
    '--dt-whiter-wt-bright-blue': '#D6E9FF',
    '--dt-whiter-wt-dark-kingBlue-transparentest': 'rgba(63, 138, 224, 0.08)',

    '--chat-bg-dt-dark-wt-whiter': '#f7fbff',
    '--chat-bg-dt-dark-wt-kingBlue': '#3F8AE0',
    '--chat-bg-dt-dark-wt-kingBlue-lighter': '#E8F1FB',
    '--chat-bg-dt-dark-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
    '--chat-bg-dt-dark-wt-kingBlueLight-transparent': 'rgba(63, 138, 224, 0.25)',
    '--chat-bg-dt-dark-wt-bright-blue': '#D6E9FF',
    '--chat-bg-dt-dark-wt-grayLight': 'rgba(63, 138, 224, 0.12)',

    '--dt-white-wt-darker': '#32394a',

    '--dt-kingBlue-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
    '--dt-kingBlue-wt-grayLight': 'rgba(63, 138, 224, 0.12)',

    '--dt-transparent-white-wt-kingBlueLight-transparenter': 'rgba(214, 233, 255, 0.5)',

    '--dt-dark-transparent-white-wt-kingBlueLight-transparenter': 'rgba(214, 233, 255, 0.5)',
    '--dt-dark-wt-kingBlueLight-transparenter': 'rgba(214, 233, 255, 0.5)',
    '--dt-dark-wt-kingBlueLight-hover': '#c0d1e5',

    '--dt-transparent-white-wt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',

    '--msg-bg-dt-gray-lt-kingBlueLight': 'rgba(63, 138, 224, 0.55)',
    '--msg-bg-dt-gray-lt-grayLight': 'rgba(63, 138, 224, 0.12)',
    '--msg-bg-dt-gray-lt-kingBlue-lighter': '#E8F1FB',
    '--msg-bg-dt-gray-lt-bright-blue': '#D6E9FF',
    '--msg-bg-dt-gray-lt-red': '#c74848',
    '--dt-white-lt-gray': '#4a5466',

    '--box-shadow-1': 'rgba(69, 107, 140, 0.5)',
    '--box-shadow-2': 'rgba(180, 180, 180, 0.7)',
    '--box-shadow-3': 'rgba(69, 107, 140, 0.5)',

    '--input-empty': 'rgba(63, 138, 224, 0.12)',
    '--input-hover': '#E8F1FB',
    '--input-active': '#D6E9FF',
    '--input-disabled': '#E5E5E5',
    '--input-placeholder': 'rgba(63, 138, 224, 0.25)',

    '--avatar-bg': '#D6E9FF',

    '--dt-semi-transparent-wt-kingBlue': '#3F8AE0',
    '--dt-semi-transparent-white-wt-kingBlueLight-transparent': 'rgba(63, 138, 224, 0.25)',
    '--dt-darker-wt-bright-blue': '#D6E9FF',
    '--blur-color': 'rgba(63, 138, 224, 0.25)',
    '--blur-color-1': 'rgba(255, 255, 255, 0.7)',
    '--disabled-btn': '#7794B8',
    '--disabled-btn-text': 'rgba(255, 255, 255, 0.5)',
    '--disabled-input': '#E5E5E5', //
    '--radio-box-bg': '#E8F1FB',
    '--modals-bg': 'rgba(213, 225, 238, 0.41)',
    '--error-bg-themed': '#EEA39D',
    '--dt-blue-wt-grayLight': '#7794B8',
  };

  const darkThemeColors: {
    [key: string]: string;
  } = {
    '--dt-dark-wt-white': '#262c38',
    '--dt-dark-wt-bright-blue': '#262c38',
    '--dt-dark-wt-kingBlueLight': '#262c38',
    '--dt-dark-wt-kingBlue': '#262c38',
    '--dt-dark-wt-whiter': '#262c38',
    '--dt-dark-wt-kingBlue-lighter': '#262c38',
    '--dt-dark-wt-kingBlueLight-transparenter': '#262c38',
    '--dt-dark-wt-kingBlueLight-hover': '#222732',
    '--dt-dark-transparent-wt-kingBlueLight-transparent': 'rgba(38, 44, 56, 0.5)',
    '--dt-dark-transparent-wt-kingBlueLight': 'rgba(38, 44, 56, 0.5)',
    '--dt-gray-transparent-wt-kingBlueLight': 'rgba(55, 63, 81, 0.5)',
    '--dt-gray-semi-transparent-wt-kingBlueLight-transparentest': 'rgba(55, 63, 81, 0.8)',
    '--dt-dark-wt-pink': '#262c38',

    '--dt-kingBlue-transparentest-wt-grayLight': 'rgba(63, 138, 224, 0.08)',

    '--dt-darker-wt-bright-blue': '#161d2e',

    '--dt-grafit-wt-kingBlue': '#373f51',
    '--dt-grafit-wt-white': '#373f51',
    '--dt-grafit-wt-kingBlueLight-transparent': '#373f51',

    '--chat-bg-dt-dark-wt-whiter': '#32394a',
    '--chat-bg-dt-dark-wt-kingBlue': '#32394a',
    '--chat-bg-dt-dark-wt-kingBlueLight': '#32394a',
    '--chat-bg-dt-dark-wt-kingBlue-lighter': '#32394a',
    '--chat-bg-dt-dark-wt-kingBlueLight-transparent': '#32394a',
    '--chat-bg-dt-dark-wt-bright-blue': '#32394a',
    '--chat-bg-dt-dark-wt-grayLight': '#32394a',

    '--dt-white-wt-darker': '#fff',

    '--msg-bg-dt-gray-lt-grayLight': '#4a5466',
    '--msg-bg-dt-gray-lt-kingBlue-lighter': '#4a5466',
    '--msg-bg-dt-gray-lt-kingBlueLight': '#4a5466',
    '--msg-bg-dt-gray-lt-bright-blue': '#4a5466',
    '--msg-bg-dt-gray-lt-red': '#4a5466',
    '--dt-white-lt-gray': '#fff',

    '--modals-bg': 'rgba(15, 23, 41, 0.7)',
    '--error-bg-themed': '#483e4a',
    '--disabled-btn': '#30598b',
    '--disabled-btn-text': 'rgba(255, 255, 255, 0.14)',
    '--disabled-input': '#464c59',
    '--radio-box-bg': 'rgba(74, 84, 102, 0.6)',

    '--upload-photo-progress': 'rgba(38, 44, 56, 0.7)',

    '--dt-transparent-white-wt-kingBlueLight-transparenter': 'rgba(255, 255, 255, 0.14)',
    '--dt-dark-transparent-white-wt-kingBlueLight-transparenter': 'rgba(74, 84, 102, 0.6)',
    '--dt-transparent-white-wt-kingBlueLight': 'rgba(214, 233, 255, 0.5)',
    '--dt-whiter-wt-bright-blue': 'rgba(255, 255, 255, 0.14)',

    '--box-shadow-1': 'rgba(14, 22, 43, 0.88)',
    '--box-shadow-2': 'rgba(14, 22, 43, 0.88)',
    '--box-shadow-3': 'rgba(14, 22, 43, 0.62)',
    '--box-shadow-4': 'rgba(14, 22, 43, 0.62)',

    '--dt-white-wt-dark': '#ffffff',
    '--dt-whiter-wt-dark-kingBlue-transparentest': 'rgba(255, 255, 255, 0.04)',
    '--dt-white-wt-kingBlueLight': '#fff',
    '--dt-white-wt-kingBlue': '#ffffff',
    '--dt-semi-transparent-wt-kingBlue': 'rgba(255, 255, 255, 0.5)',
    '--dt-semi-transparent-wt-kingBlueLight': 'rgba(255, 255, 255, 0.5)',

    '--dt-kingBlue-wt-kingBlueLight': '#3f8ae0',
    '--dt-kingBlue-wt-grayLight': '#3f8ae0',

    '--dt-blue-wt-grayLight': '#30598b',

    '--dt-semi-transparent-white-wt-kingBlueLight-transparent': 'rgba(255, 255, 255, 0.5)',

    '--input-empty': 'rgba(74, 84, 102, 0.6)',
    '--input-hover': '#4a5466',
    '--input-active': '#4a5466',
    '--input-disabled': '#464c59',
    '--input-placeholder': 'rgba(255, 255, 255, 0.14)',

    '--avatar-bg': '#161D2E',

    '--blur-color': 'rgba(38, 44, 56, 0.4)',
    '--blur-color-1': 'rgba(55, 63, 81, 0.7)',
  };

  const root = document.documentElement;

  if (theme === Theme.DARK) {
    Object.keys(darkThemeColors).forEach((color) => {
      root.style.setProperty(color, darkThemeColors[color]);
    });
  } else if (theme === Theme.LIGHT) {
    Object.keys(lightThemeColors).forEach((color) => {
      root.style.setProperty(color, lightThemeColors[color]);
    });
  }
}
