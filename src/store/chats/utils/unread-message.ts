let unreadMessageId: number;

export const setUnreadMessageId = (id: number) => {
  unreadMessageId = id;
};

export const getUnreadMessageId = () => unreadMessageId;
