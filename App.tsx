import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EditorTheme, ViewMode, EditorStats } from './types';
import { Toolbar } from './components/Toolbar';
import { MarkdownEditor } from './components/MarkdownEditor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { AISidebar } from './components/AISidebar';
import { geminiService } from './services/geminiService';
import { exportToPDF } from './utils/exportUtils';
import { FileText } from 'lucide-react';

const INITIAL_MARKDOWN = `# Welcome to Gemini MarkDraft

This is a powerful **Markdown editor** enhanced with AI capabilities.

## Features
- **AI Integration**: Ask Gemini to summarize, fix grammar, or continue writing.
- **Real-time Preview**: See your changes instantly.
- **Themes**: Switch between Light, Dark, and Dracula modes.
- **Export**: Save as Markdown or export to PDF.

## Try it out
1. Type some markdown on the left.
2. Click the "Magic Wand" icon to use AI.
3. Click "Download" to save your work.

> "Creativity is intelligence having fun." – Albert Einstein
`;

const App: React.FC = () => {
  const [content, setContent] = useState<string>(INITIAL_MARKDOWN);
  const [theme, setTheme] = useState<EditorTheme>(EditorTheme.LIGHT);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [fileName, setFileName] = useState('untitled.md');
  const previewRef = useRef<HTMLDivElement>(null);

  // Responsive check for default view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'split') {
        setViewMode('edit');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setContent(text);
        setFileName(file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (previewRef.current) {
      await exportToPDF(previewRef.current, fileName.replace('.md', ''));
    }
  };

  const handleAiAction = async (prompt: string, actionType: 'replace' | 'append' | 'analyze') => {
    try {
      const result = await geminiService.generateContent(prompt, content);
      if (result) {
        if (actionType === 'replace') {
          setContent(result);
        } else if (actionType === 'append') {
          setContent(prev => prev + '\n\n' + result);
        }
        // 'analyze' keeps the result in the sidebar, handled by sidebar component mostly
        return result;
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate AI content. Please check your API key.");
    }
    return undefined;
  };

  // Theme Classes
  const getThemeClasses = () => {
    switch (theme) {
      case EditorTheme.DARK:
        return 'bg-gray-900 text-gray-100';
      case EditorTheme.DRACULA:
        return 'bg-dracula-bg text-dracula-fg';
      default:
        return 'bg-white text-gray-900';
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${getThemeClasses()}`}>
      
      {/* Header / Toolbar */}
      <Toolbar 
        theme={theme}
        setTheme={setTheme}
        viewMode={viewMode}
        setViewMode={setViewMode}
        fileName={fileName}
        setFileName={setFileName}
        onUpload={handleFileUpload}
        onSave={handleSaveMarkdown}
        onExportPDF={handleExportPDF}
        toggleAi={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Editor Pane */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className={`flex-1 h-full overflow-hidden border-r ${theme === EditorTheme.LIGHT ? 'border-gray-200' : 'border-gray-700'}`}>
            <MarkdownEditor 
              content={content} 
              onChange={setContent} 
              theme={theme} 
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`flex-1 h-full overflow-y-auto custom-scrollbar p-8 ${theme === EditorTheme.LIGHT ? 'bg-gray-50' : ''}`}>
             <div ref={previewRef} className={`max-w-3xl mx-auto min-h-[500px] ${theme === EditorTheme.LIGHT ? 'bg-white shadow-sm p-8 rounded-lg' : ''}`}>
               <MarkdownPreview content={content} theme={theme} />
             </div>
          </div>
        )}

        {/* AI Sidebar Overlay */}
        {isAiSidebarOpen && (
           <AISidebar 
             onClose={() => setIsAiSidebarOpen(false)} 
             onAiAction={handleAiAction}
             theme={theme}
             currentContent={content}
           />
        )}
      </main>
      
      {/* Footer / Status Bar */}
      <footer className={`h-8 border-t flex items-center px-4 text-xs select-none justify-between ${theme === EditorTheme.LIGHT ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
         <div className="flex items-center space-x-4">
            <span>{content.length} chars</span>
            <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
         </div>
         <div className="flex items-center space-x-2 opacity-70">
            <FileText size={12} />
            <span>{fileName}</span>
         </div>
      </footer>
    </div>
  );
};

export default App;
