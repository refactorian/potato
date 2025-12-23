
import { useState, useCallback, useRef, useEffect } from 'react';
import { Screen, Project, CanvasElement } from '../types';

export interface HistoryItem {
  state: Screen;
  label: string;
  timestamp: number;
}

interface ScreenHistory {
  past: HistoryItem[];
  future: HistoryItem[];
}

export const useHistory = (project: Project, setProject: (p: Project) => void) => {
  const [historyMap, setHistoryMap] = useState<Record<string, ScreenHistory>>({});
  const isInternalChange = useRef(false);
  const prevScreensRef = useRef<Screen[]>(project.screens);

  // Helper to identify what changed between two screens
  const getActionLabel = (prev: Screen, current: Screen): string => {
    if (prev.elements.length < current.elements.length) return 'Element Added';
    if (prev.elements.length > current.elements.length) return 'Element Removed';
    if (prev.backgroundColor !== current.backgroundColor) return 'Background Changed';
    if (prev.viewportWidth !== current.viewportWidth || prev.viewportHeight !== current.viewportHeight) return 'Dimensions Changed';
    
    // Check for individual element changes
    for (let i = 0; i < current.elements.length; i++) {
      const el = current.elements[i];
      const pEl = prev.elements.find(e => e.id === el.id);
      if (!pEl) continue;
      
      if (el.x !== pEl.x || el.y !== pEl.y || el.width !== pEl.width || el.height !== pEl.height) {
        return `Moved ${el.name}`;
      }
      if (JSON.stringify(el.style) !== JSON.stringify(pEl.style)) {
        return `Styled ${el.name}`;
      }
      if (JSON.stringify(el.props) !== JSON.stringify(pEl.props)) {
        return `Updated ${el.name}`;
      }
    }
    
    return 'Screen Updated';
  };

  useEffect(() => {
    if (isInternalChange.current) {
        isInternalChange.current = false;
        prevScreensRef.current = project.screens;
        return;
    }

    project.screens.forEach(currentScreen => {
        const prevScreen = prevScreensRef.current.find(ps => ps.id === currentScreen.id);
        
        if (prevScreen) {
            const currentHash = JSON.stringify(currentScreen.elements) + currentScreen.backgroundColor + currentScreen.viewportWidth + currentScreen.viewportHeight;
            const prevHash = JSON.stringify(prevScreen.elements) + prevScreen.backgroundColor + prevScreen.viewportWidth + prevScreen.viewportHeight;

            if (currentHash !== prevHash) {
                const label = getActionLabel(prevScreen, currentScreen);
                
                setHistoryMap(prev => {
                    const sh = prev[currentScreen.id] || { past: [], future: [] };
                    
                    // Don't record if the last item in past is the same as the state we're about to add
                    const lastPast = sh.past[sh.past.length - 1];
                    if (lastPast && JSON.stringify(lastPast.state) === prevHash) {
                        return prev;
                    }

                    const newPastItem: HistoryItem = {
                        state: prevScreen,
                        label,
                        timestamp: Date.now()
                    };

                    return {
                        ...prev,
                        [currentScreen.id]: { 
                            past: [...sh.past, newPastItem].slice(-50), 
                            future: [] 
                        }
                    };
                });
            }
        }
    });

    prevScreensRef.current = project.screens;
  }, [project.screens]);

  const undo = useCallback((screenId: string) => {
    setHistoryMap(prev => {
      const sh = prev[screenId];
      if (!sh || sh.past.length === 0) return prev;

      const newPast = [...sh.past];
      const previousHistoryItem = newPast.pop()!;
      const currentState = project.screens.find(s => s.id === screenId)!;

      isInternalChange.current = true;
      setProject({
        ...project,
        screens: project.screens.map(s => s.id === screenId ? previousHistoryItem.state : s)
      });

      const currentAsFuture: HistoryItem = {
        state: currentState,
        label: previousHistoryItem.label,
        timestamp: Date.now()
      };

      return {
        ...prev,
        [screenId]: {
          past: newPast,
          future: [currentAsFuture, ...sh.future].slice(0, 50)
        }
      };
    });
  }, [project, setProject]);

  const redo = useCallback((screenId: string) => {
    setHistoryMap(prev => {
      const sh = prev[screenId];
      if (!sh || sh.future.length === 0) return prev;

      const newFuture = [...sh.future];
      const nextHistoryItem = newFuture.shift()!;
      const currentState = project.screens.find(s => s.id === screenId)!;

      isInternalChange.current = true;
      setProject({
        ...project,
        screens: project.screens.map(s => s.id === screenId ? nextHistoryItem.state : s)
      });

      const currentAsPast: HistoryItem = {
        state: currentState,
        label: nextHistoryItem.label,
        timestamp: Date.now()
      };

      return {
        ...prev,
        [screenId]: {
          past: [...sh.past, currentAsPast].slice(-50),
          future: newFuture
        }
      };
    });
  }, [project, setProject]);

  const jumpToHistory = useCallback((screenId: string, index: number, type: 'past' | 'future') => {
      setHistoryMap(prev => {
          const sh = prev[screenId];
          if (!sh) return prev;
          
          const currentState = project.screens.find(s => s.id === screenId)!;
          let targetItem: HistoryItem;
          let newPast: HistoryItem[];
          let newFuture: HistoryItem[];

          if (type === 'past') {
              targetItem = sh.past[index];
              newPast = sh.past.slice(0, index);
              const movingToFuture = sh.past.slice(index).map(item => ({ ...item, timestamp: Date.now() }));
              newFuture = [...movingToFuture, ...sh.future].slice(0, 50);
          } else {
              targetItem = sh.future[index];
              const movingToPast = sh.future.slice(0, index + 1).map(item => ({ ...item, timestamp: Date.now() }));
              newPast = [...sh.past, ...movingToPast].slice(-50);
              newFuture = sh.future.slice(index + 1);
          }

          isInternalChange.current = true;
          setProject({
            ...project,
            screens: project.screens.map(s => s.id === screenId ? targetItem.state : s)
          });

          return {
              ...prev,
              [screenId]: { past: newPast, future: newFuture }
          };
      });
  }, [project, setProject]);

  return {
    undo,
    redo,
    jumpToHistory,
    canUndo: (screenId: string) => (historyMap[screenId]?.past.length || 0) > 0,
    canRedo: (screenId: string) => (historyMap[screenId]?.future.length || 0) > 0,
    getHistory: (screenId: string) => historyMap[screenId] || { past: [], future: [] }
  };
};
