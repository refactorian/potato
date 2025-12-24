
import { useState, useCallback, useRef, useEffect } from 'react';
import { Project } from '../types';

export interface HistoryItem {
  state: Project;
  label: string;
  timestamp: number;
}

interface ProjectHistory {
  past: HistoryItem[];
  future: HistoryItem[];
}

export const useHistory = (project: Project, setProject: (p: Project) => void) => {
  const [history, setHistory] = useState<ProjectHistory>({ past: [], future: [] });
  const isInternalChange = useRef(false);
  const prevProjectRef = useRef<Project>(project);
  const debounceTimer = useRef<any>(null);

  const getActionLabel = (prev: Project, current: Project): string => {
    if (prev.name !== current.name) return 'Rename Project';
    if (prev.screens.length < current.screens.length) return 'Add Screen';
    if (prev.screens.length > current.screens.length) return 'Remove Screen';
    if (prev.activeScreenId !== current.activeScreenId) return 'Switch Screen';
    
    const currentActiveScreen = current.screens.find(s => s.id === current.activeScreenId);
    const prevActiveScreen = prev.screens.find(s => s.id === prev.activeScreenId);
    
    if (currentActiveScreen && prevActiveScreen) {
        if (currentActiveScreen.backgroundColor !== prevActiveScreen.backgroundColor) return 'Screen Style';
        if (currentActiveScreen.elements.length < prevActiveScreen.elements.length) return 'Delete Layer';
        if (currentActiveScreen.elements.length > prevActiveScreen.elements.length) return 'Create Layer';
        
        for (let i = 0; i < currentActiveScreen.elements.length; i++) {
            const el = currentActiveScreen.elements[i];
            const pEl = prevActiveScreen.elements.find(e => e.id === el.id);
            if (!pEl) continue;
            if (el.x !== pEl.x || el.y !== pEl.y || el.width !== pEl.width || el.height !== pEl.height) return `Move ${el.name}`;
            if (JSON.stringify(el.style) !== JSON.stringify(pEl.style)) return `Style ${el.name}`;
            if (JSON.stringify(el.props) !== JSON.stringify(pEl.props)) return `Update ${el.name}`;
        }
    }

    return 'Modify Project';
  };

  useEffect(() => {
    if (isInternalChange.current) {
        isInternalChange.current = false;
        prevProjectRef.current = project;
        return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
        const currentSnapshot = JSON.stringify({ 
            name: project.name, 
            screens: project.screens, 
            activeScreenId: project.activeScreenId,
            viewportWidth: project.viewportWidth,
            viewportHeight: project.viewportHeight,
            gridConfig: project.gridConfig
        });
        
        const prevSnapshot = JSON.stringify({ 
            name: prevProjectRef.current.name, 
            screens: prevProjectRef.current.screens, 
            activeScreenId: prevProjectRef.current.activeScreenId,
            viewportWidth: prevProjectRef.current.viewportWidth,
            viewportHeight: prevProjectRef.current.viewportHeight,
            gridConfig: prevProjectRef.current.gridConfig
        });

        if (currentSnapshot !== prevSnapshot) {
            const label = getActionLabel(prevProjectRef.current, project);
            
            setHistory(prev => ({
                past: [...prev.past, { state: prevProjectRef.current, label, timestamp: Date.now() }].slice(-50),
                future: []
            }));
        }

        prevProjectRef.current = project;
    }, 800);

    return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [project]);

  const undo = useCallback(() => {
    setHistory(prev => {
        if (prev.past.length === 0) return prev;

        const newPast = [...prev.past];
        const snapshot = newPast.pop()!;
        
        const currentStateAsFuture: HistoryItem = {
            state: project,
            label: snapshot.label,
            timestamp: Date.now()
        };

        isInternalChange.current = true;
        setProject(snapshot.state);

        return {
            past: newPast,
            future: [currentStateAsFuture, ...prev.future].slice(0, 50)
        };
    });
  }, [project, setProject]);

  const redo = useCallback(() => {
    setHistory(prev => {
        if (prev.future.length === 0) return prev;

        const newFuture = [...prev.future];
        const snapshot = newFuture.shift()!;

        const currentStateAsPast: HistoryItem = {
            state: project,
            label: snapshot.label,
            timestamp: Date.now()
        };

        isInternalChange.current = true;
        setProject(snapshot.state);

        return {
            past: [...prev.past, currentStateAsPast].slice(-50),
            future: newFuture
        };
    });
  }, [project, setProject]);

  const jumpToHistory = useCallback((index: number, type: 'past' | 'future') => {
      setHistory(prev => {
          let targetItem: HistoryItem;
          let newPast: HistoryItem[];
          let newFuture: HistoryItem[];

          if (type === 'past') {
              targetItem = prev.past[index];
              newPast = prev.past.slice(0, index);
              const currentAsFuture: HistoryItem = { state: project, label: 'Restore point', timestamp: Date.now() };
              const reversedOldPast = prev.past.slice(index + 1).reverse();
              newFuture = [currentAsFuture, ...reversedOldPast, ...prev.future].slice(0, 50);
          } else {
              targetItem = prev.future[index];
              const currentAsPast: HistoryItem = { state: project, label: 'Snapshot', timestamp: Date.now() };
              newPast = [...prev.past, currentAsPast, ...prev.future.slice(0, index)].slice(-50);
              newFuture = prev.future.slice(index + 1);
          }

          isInternalChange.current = true;
          setProject(targetItem.state);

          return { past: newPast, future: newFuture };
      });
  }, [project, setProject]);

  const clearHistory = useCallback(() => {
      setHistory({ past: [], future: [] });
  }, []);

  return {
    undo,
    redo,
    jumpToHistory,
    clearHistory,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    history
  };
};
