
import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

interface ExistingProject {
  id: string;
  name: string;
  lastModified: number;
  viewportWidth: number;
}

interface DuplicateTabProps {
  projectName: string;
  setProjectName: (name: string) => void;
  existingProjects: ExistingProject[];
  selectedProjectIdToDuplicate: string | null;
  setSelectedProjectIdToDuplicate: (id: string | null) => void;
}

export const DuplicateTab: React.FC<DuplicateTabProps> = ({
  projectName, setProjectName,
  existingProjects,
  selectedProjectIdToDuplicate, setSelectedProjectIdToDuplicate
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Select Project to Duplicate</h3>

      <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
        {existingProjects.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No projects found.</div>
        ) : (
          existingProjects.map(p => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProjectIdToDuplicate(p.id);
                setProjectName(`${p.name} (Copy)`);
              }}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${selectedProjectIdToDuplicate === p.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-200">{p.name}</div>
                  <div className="text-xs text-gray-500 flex gap-2">
                    <span>Modified: {new Date(p.lastModified).toLocaleDateString()}</span>
                    <span>&bull;</span>
                    <span>Width: {p.viewportWidth}px</span>
                  </div>
                </div>
              </div>
              {selectedProjectIdToDuplicate === p.id && <CheckCircle2 className="text-indigo-600 dark:text-indigo-400" size={20} />}
            </div>
          ))
        )}
      </div>
      {selectedProjectIdToDuplicate && (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      )}
    </div>
  );
};
