import React from 'react';
import './render-text.scss';

import { EMOJI_REGEX, IS_EMOJI_SUPPORTED } from '../emoji-constants';

type TextPart = string | JSX.Element;

const vs16RegExp = /\uFE0F/g;
// avoid using a string literal like '\u200D' here because minifiers expand it inline
const zeroWidthJoiner = String.fromCharCode(0x200d);

export function removeVS16s(rawEmoji: any) {
  return rawEmoji.indexOf(zeroWidthJoiner) < 0 ? rawEmoji.replace(vs16RegExp, '') : rawEmoji;
}

export default function renderText(
  part: TextPart,
  filters: ('escape_html' | 'emoji' | 'emoji_html' | 'br_html')[] = ['emoji'],
): TextPart[] {
  if (typeof part !== 'string') {
    return [part];
  }

  return filters.reduce(
    (text, filter) => {
      switch (filter) {
        case 'escape_html':
          return escapeHtml(text);

        case 'emoji':
          EMOJI_REGEX.lastIndex = 0;
          return replaceEmojis(text, 'jsx');

        case 'emoji_html':
          EMOJI_REGEX.lastIndex = 0;
          return replaceEmojis(text, 'html');

        case 'br_html':
          return addLineBreaks(text);

        default:
          return text;
      }
    },
    [part] as TextPart[],
  );
}

function escapeHtml(textParts: TextPart[]): TextPart[] {
  const divEl = document.createElement('div');
  return textParts.reduce((result, part) => {
    if (typeof part !== 'string') {
      return [...result, part];
    }

    divEl.innerText = part;

    return [...result, divEl.innerHTML];
  }, [] as TextPart[]);
}

function addLineBreaks(textParts: TextPart[]): TextPart[] {
  return textParts.reduce((result, part) => {
    if (typeof part !== 'string') {
      return [...result, part];
    }

    return [
      ...result,
      ...part.split(/\r\n|\r|\n/g).reduce((parts: TextPart[], line: string, i, source) => {
        // This adds non-breaking space if line was indented with spaces, to preserve the indentation
        const trimmedLine = line.trimLeft();
        const indentLength = line.length - trimmedLine.length;
        parts.push(String.fromCharCode(160).repeat(indentLength) + trimmedLine);

        if (i !== source.length - 1) {
          parts.push('<br />');
        }

        return parts;
      }, []),
    ];
  }, [] as TextPart[]);
}

function nativeToUnfified(emoji: string) {
  let code;

  if (emoji.length === 1) {
    code = emoji.charCodeAt(0).toString(16).padStart(4, '0');
  } else {
    const pairs = [];
    for (let i = 0; i < emoji.length; i += 1) {
      if (emoji.charCodeAt(i) >= 0xd800 && emoji.charCodeAt(i) <= 0xdbff) {
        if (emoji.charCodeAt(i + 1) >= 0xdc00 && emoji.charCodeAt(i + 1) <= 0xdfff) {
          pairs.push(
            (emoji.charCodeAt(i) - 0xd800) * 0x400 + (emoji.charCodeAt(i + 1) - 0xdc00) + 0x10000,
          );
        }
      } else if (emoji.charCodeAt(i) < 0xd800 || emoji.charCodeAt(i) > 0xdfff) {
        pairs.push(emoji.charCodeAt(i));
      }
    }

    code = pairs.map((x) => x.toString(16).padStart(4, '0')).join('-');
  }

  return code;
}

function replaceEmojis(textParts: TextPart[], type: 'jsx' | 'html'): TextPart[] {
  if (IS_EMOJI_SUPPORTED) {
    return textParts;
  }

  return textParts.reduce((result, part) => {
    if (typeof part !== 'string') {
      return [...result, part];
    }

    const parts = part.split(EMOJI_REGEX);
    const emojis = part.match(EMOJI_REGEX) || [];
    result.push(parts[0]);

    return emojis.reduce((emojiResult: TextPart[], emoji, i) => {
      const code = nativeToUnfified(removeVS16s(emoji));
      const className = 'rendered-emoji';
      if (type === 'jsx') {
        emojiResult.push(
          <img
            // eslint-disable-next-line react/no-array-index-key
            key={`emoji${code}${i}`}
            className={className}
            src={`https://raw.githubusercontent.com/korenskoy/emoji-data-ios/master/img-apple-64/${code}.png`}
            alt={emoji}
          />,
        );
      }
      if (type === 'html') {
        emojiResult.push(
          // For preventing extra spaces in html
          // eslint-disable-next-line max-len
          `<img draggable="false" class="${className}" src="https://raw.githubusercontent.com/korenskoy/emoji-data-ios/master/img-apple-64/${code}.png" alt="${emoji}" />`,
        );
      }

      const index = i * 2 + 2;
      if (parts[index]) {
        emojiResult.push(parts[index]);
      }

      return emojiResult;
    }, result);
  }, [] as TextPart[]);
}
