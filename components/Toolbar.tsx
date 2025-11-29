import React from 'react';
import { EditorTheme, ViewMode } from '../types';
import { 
  Download, 
  Upload, 
  FileText, 
  Moon, 
  Sun, 
  Columns, 
  Eye, 
  Edit3, 
  Sparkles,
  Palette,
  FileDown
} from 'lucide-react';

interface ToolbarProps {
  theme: EditorTheme;
  setTheme: (t: EditorTheme) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  fileName: string;
  setFileName: (n: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onExportPDF: () => void;
  toggleAi: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  theme,
  setTheme,
  viewMode,
  setViewMode,
  fileName,
  setFileName,
  onUpload,
  onSave,
  onExportPDF,
  toggleAi
}) => {
  
  const isDark = theme !== EditorTheme.LIGHT;
  const btnClass = `p-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
    isDark 
      ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
      : 'hover:bg-gray-200 text-gray-600 hover:text-black'
  }`;

  return (
    <header className={`h-16 border-b px-4 flex items-center justify-between shrink-0 ${
      isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Left: Branding & File Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
           <FileText className="text-blue-500" />
           <span className="hidden sm:inline">MarkDraft</span>
        </div>
        
        <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

        <input 
          type="text" 
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className={`bg-transparent border-none focus:ring-0 font-medium text-sm w-32 sm:w-48 ${
            isDark ? 'text-gray-300 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'
          }`}
          placeholder="Filename"
        />
      </div>

      {/* Center: View Controls (Desktop) */}
      <div className="hidden md:flex bg-gray-100/10 p-1 rounded-lg border border-gray-500/20">
         <button 
           onClick={() => setViewMode('edit')}
           className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 ${viewMode === 'edit' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
         >
           <Edit3 size={14} /> Edit
         </button>
         <button 
           onClick={() => setViewMode('split')}
           className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 ${viewMode === 'split' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
         >
           <Columns size={14} /> Split
         </button>
         <button 
           onClick={() => setViewMode('preview')}
           className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 ${viewMode === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
         >
           <Eye size={14} /> Preview
         </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button 
          onClick={toggleAi}
          className={`p-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 mr-2`}
          title="AI Assistant"
        >
          <Sparkles size={18} />
        </button>

        <label className={btnClass} title="Upload Markdown">
          <Upload size={18} />
          <input type="file" accept=".md,.txt" onChange={onUpload} className="hidden" />
        </label>

        <button onClick={onSave} className={btnClass} title="Save Markdown">
          <Download size={18} />
        </button>
        
        <button onClick={onExportPDF} className={btnClass} title="Export PDF">
          <FileDown size={18} />
        </button>

        <div className={`h-6 w-px mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

        <div className="relative group">
           <button className={btnClass}>
             <Palette size={18} />
           </button>
           <div className={`absolute right-0 top-full mt-2 w-32 rounded-lg shadow-xl border overflow-hidden z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div 
                onClick={() => setTheme(EditorTheme.LIGHT)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${theme === EditorTheme.LIGHT ? 'text-blue-500 font-bold' : ''}`}
              >
                <Sun size={14} /> Light
              </div>
              <div 
                 onClick={() => setTheme(EditorTheme.DARK)}
                 className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${theme === EditorTheme.DARK ? 'text-blue-500 font-bold' : ''}`}
              >
                <Moon size={14} /> Dark
              </div>
              <div 
                 onClick={() => setTheme(EditorTheme.DRACULA)}
                 className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${theme === EditorTheme.DRACULA ? 'text-blue-500 font-bold' : ''}`}
              >
                <span className="w-3 h-3 rounded-full bg-purple-500"></span> Dracula
              </div>
           </div>
        </div>
      </div>
    </header>
  );
};
