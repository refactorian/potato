
import { useState } from 'react';

export const useSelection = () => {
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [selectedScreenIds, setSelectedScreenIds] = useState<string[]>([]);
  const [selectedScreenGroupIds, setSelectedScreenGroupIds] = useState<string[]>([]);

  const clearAllSelections = () => {
      setSelectedElementIds([]);
      setSelectedScreenIds([]);
      setSelectedScreenGroupIds([]);
  };

  return {
      selectedElementIds,
      setSelectedElementIds,
      selectedScreenIds,
      setSelectedScreenIds,
      selectedScreenGroupIds,
      setSelectedScreenGroupIds,
      clearAllSelections
  };
};
