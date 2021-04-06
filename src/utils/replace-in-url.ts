import replace from 'lodash/replace';

type Replacement = [string, string | number];

export function replaceInUrl(url: string, ...replacementPairs: Replacement[]): string {
  return replacementPairs.reduce((res, [key, val]) => replace(res, `:${key}`, `${val}`), url);
}
