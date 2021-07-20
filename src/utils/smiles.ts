export type EmojiRawData = typeof import('emoji-data-ios/emoji-data.json');

export type EmojiData = {
  categories: Array<EmojiCategory>;
  emojis: Record<string, IEmoji>;
};

type EmojiCategory = {
  id: string;
  name: string;
  emojis: string[];
};

export interface IEmoji {
  id: string;
  names: string[];
  native: string;
  image: string;
  skin?: number;
}

function unifiedToNative(unified: string) {
  const unicodes = unified.split('-');
  const codePoints = unicodes.map((i) => parseInt(i, 16));

  return String.fromCodePoint(...codePoints);
}

export function uncompressEmoji(data: EmojiRawData): EmojiData {
  const emojiData: EmojiData = { categories: [], emojis: {} };

  for (let i = 0; i < data.length; i += 2) {
    const category = {
      id: data[i][0],
      name: data[i][1],
      emojis: [],
    } as EmojiCategory;

    for (let j = 0; j < data[i + 1].length; j += 1) {
      const emojiRaw = data[i + 1][j];
      category.emojis.push(emojiRaw[1][0]);
      emojiData.emojis[emojiRaw[1][0]] = {
        id: emojiRaw[1][0],
        names: emojiRaw[1] as string[],
        native: unifiedToNative(emojiRaw[0] as string),
        image: (emojiRaw[0] as string).toLowerCase(),
      };
    }

    emojiData.categories.push(category);
  }

  return emojiData;
}
