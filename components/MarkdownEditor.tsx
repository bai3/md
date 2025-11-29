import React from 'react';
import { EditorTheme } from '../types';

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  theme: EditorTheme;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content, onChange, theme }) => {
  const getEditorStyles = () => {
    switch (theme) {
      case EditorTheme.DARK:
        return 'bg-gray-900 text-gray-100 caret-blue-500';
      case EditorTheme.DRACULA:
        return 'bg-[#282a36] text-[#f8f8f2] caret-[#ff79c6]';
      default:
        return 'bg-white text-gray-900 caret-blue-600';
    }
  };

  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-full resize-none p-6 font-mono text-sm sm:text-base outline-none custom-scrollbar leading-relaxed ${getEditorStyles()}`}
      placeholder="Start typing your markdown here..."
      spellCheck={false}
    />
  );
};
