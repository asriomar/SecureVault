import React, { useState, useEffect } from 'react';
import { User, FileItem } from '../types';
import { Button } from '../components/Button';
import { FileText, Image as ImageIcon, FolderArchive, Download, LogOut, Sparkles, Search } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface DownloadPageProps {
  user: User;
  onLogout: () => void;
}

const MOCK_FILES: FileItem[] = [
  { id: '1', name: 'Project_Phoenix_Specs.pdf', size: '2.4 MB', type: 'pdf', date: '2023-10-24' },
  { id: '2', name: 'Design_Assets_v2.zip', size: '156 MB', type: 'zip', date: '2023-10-25' },
  { id: '3', name: 'Q4_Financial_Report.doc', size: '845 KB', type: 'doc', date: '2023-10-26' },
  { id: '4', name: 'Marketing_Banner_Hero.png', size: '4.2 MB', type: 'img', date: '2023-10-27' },
  { id: '5', name: 'Backend_Architecture_Diagram.pdf', size: '1.1 MB', type: 'pdf', date: '2023-10-28' },
  { id: '6', name: 'Client_Meeting_Notes.doc', size: '12 KB', type: 'doc', date: '2023-10-28' },
];

export const DownloadPage: React.FC<DownloadPageProps> = ({ user, onLogout }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert("File downloaded successfully (Mock)");
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'zip': return <FolderArchive className="w-8 h-8 text-yellow-500" />;
      case 'img': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      default: return <FileText className="w-8 h-8 text-slate-500" />;
    }
  };

  // Gemini Integration for personalized welcome
  useEffect(() => {
    const generateWelcome = async () => {
        if (!process.env.API_KEY) return;
        
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a short, professional but warm welcome message for a user named "${user.name}" who has just logged into the "SecureVault" download area. Keep it under 20 words.`,
            });
            setWelcomeMessage(response.text);
        } catch (e) {
            console.error("Gemini error:", e);
            setWelcomeMessage(`Welcome back, ${user.name}.`);
        } finally {
            setIsGenerating(false);
        }
    };

    generateWelcome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <span className="font-bold text-xl text-slate-900">SecureVault</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <button 
                onClick={onLogout}
                className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Hero / Welcome */}
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                Downloads Area
                {isGenerating && <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />}
            </h1>
            <p className="mt-2 text-slate-600 text-lg">
                {welcomeMessage || `Welcome back, ${user.name}. Access your secure files below.`}
            </p>
        </div>

        {/* Search Filter (Mock) */}
        <div className="mb-8">
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search files..."
                />
            </div>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_FILES.map((file) => (
            <div key={file.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
              <div className="p-6 flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    {getIcon(file.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1" title={file.name}>
                        {file.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{file.size} • {file.date}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-200 text-slate-600 uppercase">
                    {file.type}
                </span>
                <button 
                    onClick={() => handleDownload(file.id)}
                    disabled={downloadingId === file.id}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors"
                >
                    {downloadingId === file.id ? (
                        <>
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping mr-2"></span>
                            Downloading...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                        </>
                    )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
            <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100 flex items-start">
                <div className="flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-800">Pro Tip</h3>
                    <div className="mt-2 text-sm text-indigo-700">
                        <p>
                            Backend is simulated using browser storage for this demo. 
                            To run the actual Node.js backend, see the <code>server/server.js</code> file included in the source.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};