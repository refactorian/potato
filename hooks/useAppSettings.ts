
import { useState, useEffect } from 'react';
import { AppSettings } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
    autoNavigateToLayers: false,
    showTooltips: true,
    defaultGridVisible: true,
    defaultSnapToGrid: true,
    showHotspots: true
};

export const useAppSettings = () => {
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
      const saved = localStorage.getItem('potato_app_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
      localStorage.setItem('potato_app_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  return { appSettings, setAppSettings };
};
