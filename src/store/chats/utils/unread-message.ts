let unreadMessageId: number | null = null;

export const setUnreadMessageId = (id: number | null) => {
  unreadMessageId = id;
};

export const getUnreadMessageId = () => unreadMessageId;
