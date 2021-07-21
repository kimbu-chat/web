export type AllowedFontSize = 12 | 14 | 16 | 18 | 24;
export const isFontSizeAllowed = (fontSize: number) => [12, 14, 16, 18, 24].includes(fontSize);
