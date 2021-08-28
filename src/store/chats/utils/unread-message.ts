let unreadMessageId: string | null = null;

export const setUnreadMessageId = (id: string | null) => {
  unreadMessageId = id;
};

export const getUnreadMessageId = () => unreadMessageId;
