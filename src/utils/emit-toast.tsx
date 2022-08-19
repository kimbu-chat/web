import React from 'react';

import { ToastContent, ToastOptions, toast } from 'react-toastify';

import { ReactComponent as ErrorSvg } from '@icons/bulb.svg';
import { ReactComponent as GenericSvg } from '@icons/generic-toast.svg';
import { ReactComponent as InfoSvg } from '@icons/info-toast.svg';
import { ReactComponent as SuccessSvg } from '@icons/success.svg';
import { ReactComponent as WarningSvg } from '@icons/warning.svg';

export const emitToast = (content: ToastContent, options?: ToastOptions | undefined) => {
  switch (options?.type) {
    case 'success': {
      toast(
        <>
          <SuccessSvg />
          <span>{content}</span>
        </>,
        options,
      );
      break;
    }
    case 'info': {
      toast(
        <>
          <InfoSvg />
          <span>{content}</span>
        </>,
        options,
      );
      break;
    }
    case 'error': {
      toast(
        <>
          <ErrorSvg />
          <span>{content}</span>
        </>,
        options,
      );
      break;
    }
    case 'warning': {
      toast(
        <>
          <WarningSvg />
          <span>{content}</span>
        </>,
        options,
      );
      break;
    }
    default: {
      toast(
        <>
          <GenericSvg />
          <span>{content}</span>
        </>,
        options,
      );
    }
  }
};
