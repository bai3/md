import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, FastForward, CheckCheck, Loader2 } from 'lucide-react';
import { EditorTheme } from '../types';

interface AISidebarProps {
  onClose: () => void;
  onAiAction: (prompt: string, actionType: 'replace' | 'append' | 'analyze') => Promise<string | undefined>;
  theme: EditorTheme;
  currentContent: string;
}

export const AISidebar: React.FC<AISidebarProps> = ({ onClose, onAiAction, theme, currentContent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const isDark = theme !== EditorTheme.LIGHT;
  const bgClass = isDark ? 'bg-gray-800 border-l border-gray-700 text-gray-100' : 'bg-white border-l border-gray-200 text-gray-800';
  const cardClass = isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100';

  const handleAction = async (prompt: string, type: 'replace' | 'append' | 'analyze', displayLabel?: string) => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await onAiAction(prompt, type);
      if (type === 'analyze' && res) {
        setResult(res);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-80 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${bgClass}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-bold flex items-center gap-2">
          <Sparkles size={18} className="text-purple-500" />
          AI Assistant
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase opacity-60 tracking-wider">Quick Actions</h3>
          
          <button 
            disabled={isLoading}
            onClick={() => handleAction("Proofread the following markdown text, fixing grammar and spelling errors. Keep the same markdown structure.", 'replace')}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${cardClass}`}
          >
            <div className="bg-blue-100 text-blue-600 p-2 rounded-md">
              <CheckCheck size={16} />
            </div>
            <div>
              <div className="font-medium text-sm">Fix Grammar</div>
              <div className="text-xs opacity-70">Corrects errors in place</div>
            </div>
          </button>

          <button 
            disabled={isLoading}
            onClick={() => handleAction("Continue writing the following markdown text creatively. Maintain the tone and style.", 'append')}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${cardClass}`}
          >
            <div className="bg-green-100 text-green-600 p-2 rounded-md">
              <FastForward size={16} />
            </div>
            <div>
              <div className="font-medium text-sm">Continue Writing</div>
              <div className="text-xs opacity-70">Generates next paragraph</div>
            </div>
          </button>

          <button 
            disabled={isLoading}
            onClick={() => handleAction("Summarize the following markdown content into a bulleted list.", 'analyze')}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${cardClass}`}
          >
            <div className="bg-orange-100 text-orange-600 p-2 rounded-md">
              <MessageSquare size={16} />
            </div>
            <div>
              <div className="font-medium text-sm">Summarize</div>
              <div className="text-xs opacity-70">Get key points</div>
            </div>
          </button>
        </div>

        {/* Custom Prompt */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold uppercase opacity-60 tracking-wider mb-2">Custom Ask</h3>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="E.g., Rewrite the introduction to be more funny..."
            className={`w-full p-3 rounded-lg text-sm mb-2 outline-none border focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`}
            rows={3}
          />
          <button
            disabled={isLoading || !customPrompt.trim()}
            onClick={() => handleAction(customPrompt, 'replace')} // Defaulting to replace/edit for custom, could be configurable
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ask Gemini
          </button>
        </div>

        {/* Results Area (for Summarize/Analyze) */}
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-blue-500">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        {result && (
          <div className={`mt-4 p-4 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'}`}>
             <h4 className="font-bold text-sm mb-2">Result:</h4>
             <div className="text-sm prose prose-sm dark:prose-invert">
                {result}
             </div>
             <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setResult(null);
                }}
                className="mt-3 text-xs text-blue-500 hover:underline"
             >
               Copy to Clipboard
             </button>
          </div>
        )}

      </div>
    </div>
  );
};
