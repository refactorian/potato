
import React, { useState } from 'react';
import { Project, LeftSidebarTab, ExportConfig } from '../types';
import { ScreensPage } from './ScreensPage';
import { TaskPage } from './TaskPage';
import { LayoutGrid, ListTodo } from 'lucide-react';

interface ProjectOverviewProps {
  project: Project;
  setProject: (p: Project) => void;
  setActiveTab: (tab: LeftSidebarTab) => void;
  onExport: (config: Omit<ExportConfig, 'isOpen'>) => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = (props) => {
  const [activeSubTab, setActiveSubTab] = useState<'screens' | 'task'>('screens');

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden relative">
            {activeSubTab === 'screens' ? (
                <ScreensPage {...props} />
            ) : (
                <TaskPage />
            )}
        </div>

        {/* Floating Tab Menu */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                <button
                    onClick={() => setActiveSubTab('screens')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeSubTab === 'screens'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    <LayoutGrid size={16} />
                    <span>Screens</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('task')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeSubTab === 'task'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    <ListTodo size={16} />
                    <span>Tasks</span>
                </button>
            </div>
        </div>
    </div>
  );
};
