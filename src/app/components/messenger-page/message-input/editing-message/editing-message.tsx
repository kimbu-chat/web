import React from 'react';

const EditingMessage: React.FC = () => {
  const str = 'hi';
  return <div className='editing-message'>{str}</div>;
};

EditingMessage.displayName = 'EditingMessage';

export { EditingMessage };
