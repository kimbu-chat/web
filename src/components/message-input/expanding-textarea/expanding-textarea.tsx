import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import {
  getSelectedChatSelector,
  getMessageToReplySelector,
  getMessageToEditSelector,
} from '@store/chats/selectors';

export const ExpandingTextarea: React.FC<
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
> = (props) => {
  const selectedChat = useSelector(getSelectedChatSelector);
  const replyingMessage = useSelector(getMessageToReplySelector);
  const editingMessage = useSelector(getMessageToEditSelector);

  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { value } = props;

  useEffect(() => {
    textareaRef.current?.focus();
  }, [selectedChat?.id, replyingMessage, editingMessage]);

  useEffect(() => {
    if (textareaRef.current) {
      const minRows = 1;
      const maxRows = 20;
      const textareaLineHeight = 18;
      const previousRows = textareaRef.current?.rows;

      textareaRef.current.rows = minRows;

      // eslint-disable-next-line no-bitwise
      const currentRows = ~~(textareaRef.current.scrollHeight / textareaLineHeight);

      if (currentRows === previousRows) {
        textareaRef.current.rows = currentRows;
      }

      if (currentRows >= maxRows) {
        textareaRef.current.rows = maxRows;
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }

      setRows(currentRows < maxRows ? currentRows : maxRows);
    }
  }, [value, textareaRef]);

  return <textarea rows={rows} ref={textareaRef} {...props} />;
};
