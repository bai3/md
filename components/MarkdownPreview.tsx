import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditorTheme } from '../types';

interface MarkdownPreviewProps {
  content: string;
  theme: EditorTheme;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, theme }) => {
  
  // Tailwind Typography (prose) classes based on theme
  const getProseClass = () => {
    switch (theme) {
      case EditorTheme.DARK:
      case EditorTheme.DRACULA:
        return 'prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700';
      default:
        return 'prose-stone prose-pre:bg-gray-100 prose-pre:text-gray-900';
    }
  };

  return (
    <article className={`prose max-w-none ${getProseClass()} transition-colors duration-300`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
              <div className="relative group">
                <code className={`${className} block p-4 rounded-lg overflow-x-auto`} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className={`${className} px-1.5 py-0.5 rounded bg-opacity-20 bg-gray-500`} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
