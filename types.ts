export enum EditorTheme {
  LIGHT = 'light',
  DARK = 'dark',
  DRACULA = 'dracula',
}

export interface EditorStats {
  chars: number;
  words: number;
}

export type ViewMode = 'split' | 'edit' | 'preview';

export interface AiResponse {
  text: string;
}
