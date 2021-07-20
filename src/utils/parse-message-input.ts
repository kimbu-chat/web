import { IS_EMOJI_SUPPORTED } from './constants';

export function parseMarkdown(html: string) {
  let parsedHtml = html.slice(0);

  if (!IS_EMOJI_SUPPORTED) {
    // Emojis
    parsedHtml = parsedHtml.replace(/<img[^>]+alt="([^"]+)"[^>]*>/gm, '$1');
  }

  // Strip redundant <span> tags
  parsedHtml = parsedHtml.replace(/<\/?span([^>]*)?>/g, '');

  // Strip redundant nbsp's
  parsedHtml = parsedHtml.replace(/&nbsp;/g, ' ');

  // Replace <br> with newline
  parsedHtml = parsedHtml.replace(/<br([^>]*)?>/g, '\n');

  // Strip redundant <div> tags
  parsedHtml = parsedHtml.replace(/<\/div>(\s*)<div>/g, '\n');
  parsedHtml = parsedHtml.replace(/<div>/g, '\n');
  parsedHtml = parsedHtml.replace(/<\/div>/g, '');

  // Pre
  parsedHtml = parsedHtml.replace(/^`{3}(.*[\n\r][^]*?^)`{3}/gm, '<pre>$1</pre>');
  parsedHtml = parsedHtml.replace(/[`]{3}([^`]+)[`]{3}/g, '<pre>$1</pre>');

  // Code
  parsedHtml = parsedHtml.replace(/[`]{1}([^`\n]+)[`]{1}/g, '<code>$1</code>');

  // Other simple markdown
  parsedHtml = parsedHtml.replace(/[*]{2}([^*\n]+)[*]{2}/g, '<b>$1</b>');
  parsedHtml = parsedHtml.replace(/[_]{2}([^*\n]+)[_]{2}/g, '<i>$1</i>');
  parsedHtml = parsedHtml.replace(/[~]{2}([^~\n]+)[~]{2}/g, '<s>$1</s>');

  return parsedHtml;
}

export function parseMessageInput(html: string) {
  const fragment = document.createElement('div');
  fragment.innerHTML = parseMarkdown(html);
  const text = fragment.innerText.trim().replace(/\u200b+/g, '');

  return text;
}
