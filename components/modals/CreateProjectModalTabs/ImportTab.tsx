
import React, { useState, useCallback } from 'react';
import { Upload, FileJson, Archive, CheckCircle2, AlertCircle, X, Trash2, Edit2 } from 'lucide-react';
import { Project } from '../../../types';
import JSZip from 'jszip';

interface ImportCandidate {
  id: string;
  originalName: string; // Filename
  project: Project | null;
  status: 'valid' | 'invalid' | 'loading';
  error?: string;
  editedName: string;
}

interface ImportTabProps {
  setImportedProjects: (projects: Project[]) => void;
}

export const ImportTab: React.FC<ImportTabProps> = ({ setImportedProjects }) => {
  const [candidates, setCandidates] = useState<ImportCandidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validate Project Structure
  const isValidProject = (obj: any): boolean => {
      return (
          obj && 
          typeof obj === 'object' && 
          Array.isArray(obj.screens) && 
          typeof obj.name === 'string' &&
          (obj.gridConfig === undefined || typeof obj.gridConfig === 'object')
      );
  };

  const processFile = async (file: File): Promise<ImportCandidate[]> => {
      const results: ImportCandidate[] = [];
      const fileId = Math.random().toString(36).substr(2, 9);

      if (file.name.endsWith('.json')) {
          try {
              const text = await file.text();
              const json = JSON.parse(text);
              if (isValidProject(json)) {
                  results.push({
                      id: fileId,
                      originalName: file.name,
                      project: json,
                      status: 'valid',
                      editedName: json.name || file.name.replace('.json', '')
                  });
              } else {
                  results.push({
                      id: fileId,
                      originalName: file.name,
                      project: null,
                      status: 'invalid',
                      editedName: file.name,
                      error: 'Invalid Project JSON structure.'
                  });
              }
          } catch (e) {
              results.push({
                  id: fileId,
                  originalName: file.name,
                  project: null,
                  status: 'invalid',
                  editedName: file.name,
                  error: 'JSON parsing failed.'
              });
          }
      } else if (file.name.endsWith('.zip')) {
          try {
              const zip = await JSZip.loadAsync(file);
              const fileNames = Object.keys(zip.files);
              
              // Process contents
              for (const fileName of fileNames) {
                  if (fileName.endsWith('.json') && !fileName.startsWith('__MACOSX')) {
                      const subId = Math.random().toString(36).substr(2, 9);
                      try {
                          const content = await zip.files[fileName].async('string');
                          const json = JSON.parse(content);
                          if (isValidProject(json)) {
                              results.push({
                                  id: subId,
                                  originalName: fileName,
                                  project: json,
                                  status: 'valid',
                                  editedName: json.name || fileName.replace('.json', '')
                              });
                          } else {
                              results.push({
                                  id: subId,
                                  originalName: fileName,
                                  project: null,
                                  status: 'invalid',
                                  editedName: fileName,
                                  error: 'Invalid JSON inside ZIP.'
                              });
                          }
                      } catch (e) {
                          results.push({
                              id: subId,
                              originalName: fileName,
                              project: null,
                              status: 'invalid',
                              editedName: fileName,
                              error: 'Could not read JSON from ZIP.'
                          });
                      }
                  }
              }
              if (results.length === 0) {
                   results.push({
                      id: fileId,
                      originalName: file.name,
                      project: null,
                      status: 'invalid',
                      editedName: file.name,
                      error: 'No valid JSON files found in archive.'
                  });
              }
          } catch (e) {
              results.push({
                  id: fileId,
                  originalName: file.name,
                  project: null,
                  status: 'invalid',
                  editedName: file.name,
                  error: 'Failed to open ZIP file.'
              });
          }
      } else {
           results.push({
              id: fileId,
              originalName: file.name,
              project: null,
              status: 'invalid',
              editedName: file.name,
              error: 'Unsupported file format.'
          });
      }
      return results;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    let newCandidates: ImportCandidate[] = [];

    // Cast Array.from(files) to File[] to satisfy the processFile parameter type
    for (const file of Array.from(files) as File[]) {
        const candidatesFromFile = await processFile(file);
        newCandidates = [...newCandidates, ...candidatesFromFile];
    }

    setCandidates(prev => {
        const updated = [...prev, ...newCandidates];
        updateParent(updated);
        return updated;
    });
    setIsProcessing(false);
    
    // Reset input
    e.target.value = '';
  };

  const removeCandidate = (id: string) => {
      setCandidates(prev => {
          const updated = prev.filter(c => c.id !== id);
          updateParent(updated);
          return updated;
      });
  };

  const updateName = (id: string, newName: string) => {
      setCandidates(prev => {
          const updated = prev.map(c => 
              c.id === id ? { ...c, editedName: newName, project: c.project ? { ...c.project, name: newName } : null } : c
          );
          updateParent(updated);
          return updated;
      });
  };

  const updateParent = (currentCandidates: ImportCandidate[]) => {
      const validProjects = currentCandidates
          .filter(c => c.status === 'valid' && c.project)
          .map(c => c.project as Project);
      setImportedProjects(validProjects);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Import Projects</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Upload .json project files or .zip archives containing projects.</p>
      </div>

      <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors shrink-0 mb-4 ${isProcessing ? 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-wait' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
        <div className="flex flex-col items-center justify-center pt-2 pb-2">
          {isProcessing ? (
              <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
          ) : (
              <Upload className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{isProcessing ? 'Processing files...' : 'Click to select files'}</p>
        </div>
        <input type="file" className="hidden" accept=".json,.zip" multiple onChange={handleFileUpload} disabled={isProcessing} />
      </label>

      {/* Candidates List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 min-h-0 pr-1">
          {candidates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm italic">
                  No files selected.
              </div>
          )}
          
          {candidates.map(candidate => (
              <div key={candidate.id} className={`flex items-center p-3 rounded-lg border ${candidate.status === 'valid' ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10'}`}>
                  <div className={`p-2 rounded-lg mr-3 ${candidate.status === 'valid' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-red-100 text-red-500 dark:bg-red-900/30'}`}>
                      {candidate.originalName.endsWith('.zip') ? <Archive size={20} /> : <FileJson size={20} />}
                  </div>
                  
                  <div className="flex-1 min-w-0 mr-4">
                      {candidate.status === 'valid' ? (
                          <div className="flex flex-col">
                              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Project Name</label>
                              <div className="relative group">
                                <input 
                                    type="text" 
                                    value={candidate.editedName}
                                    onChange={(e) => updateName(candidate.id, e.target.value)}
                                    className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none text-sm font-medium text-gray-800 dark:text-gray-200 pb-0.5 transition-all"
                                />
                                <Edit2 size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 pointer-events-none" />
                              </div>
                              <div className="text-[10px] text-gray-400 truncate mt-1">Source: {candidate.originalName}</div>
                          </div>
                      ) : (
                          <div>
                              <div className="text-sm font-medium text-red-600 dark:text-red-400 truncate">{candidate.originalName}</div>
                              <div className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                                  <AlertCircle size={10} /> {candidate.error || 'Unknown Error'}
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="flex items-center gap-2">
                      {candidate.status === 'valid' && (
                          <div className="text-green-500 flex items-center gap-1 text-xs font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                              <CheckCircle2 size={12} /> Ready
                          </div>
                      )}
                      <button 
                        onClick={() => removeCandidate(candidate.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Remove"
                      >
                          <Trash2 size={16} />
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
