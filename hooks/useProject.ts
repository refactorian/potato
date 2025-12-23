import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, Screen } from '../types';
import { PROJECT_TEMPLATES } from '../data/projectTemplates/index.ts';

const getInitialProject = (): Project => {
    // 1. Try to load existing projects from index
    try {
        const indexStr = localStorage.getItem('potato_projects_index');
        if (indexStr) {
            const list = JSON.parse(indexStr);
            if (list.length > 0) {
                // Get the most recently modified project
                const lastProject = list.sort((a: any, b: any) => b.lastModified - a.lastModified)[0];
                const projectData = localStorage.getItem(`potato_project_${lastProject.id}`);
                if (projectData) return JSON.parse(projectData);
            }
        }
    } catch (e) {
        console.error("Error loading initial project", e);
    }

    // 2. Fallback to "Standard Framework" Template if nothing else exists
    const blankTemplate = PROJECT_TEMPLATES.find(t => t.id === 'starter-blank');
    if (blankTemplate) {
        return {
            ...blankTemplate.projectData,
            id: uuidv4(),
            lastModified: Date.now()
        } as Project;
    }

    // 3. Absolute hardcoded fallback if template system is completely broken
    const fallbackId = uuidv4();
    const fallbackScreen: Screen = { 
        id: 'screen-1', 
        name: 'Home', 
        backgroundColor: '#ffffff', 
        elements: [], 
        viewportWidth: 375, 
        viewportHeight: 812, 
        gridConfig: { visible: true, size: 20, color: '#cbd5e1', snapToGrid: true } 
    };
    
    return {
        id: fallbackId,
        name: 'New Project',
        lastModified: Date.now(),
        viewportWidth: 375,
        viewportHeight: 812,
        activeScreenId: 'screen-1',
        assets: [],
        screenGroups: [],
        gridConfig: { visible: true, size: 20, color: '#cbd5e1', snapToGrid: true },
        screens: [fallbackScreen]
    };
};

export const useProject = () => {
  const [project, setProject] = useState<Project>(getInitialProject);

  useEffect(() => {
      const saveProject = () => {
          try {
              localStorage.setItem(`potato_project_${project.id}`, JSON.stringify(project));
              const indexStr = localStorage.getItem('potato_projects_index');
              let list = indexStr ? JSON.parse(indexStr) : [];
              
              // Maintain index
              list = list.filter((p: any) => p.id !== project.id);
              list.unshift({ id: project.id, name: project.name, lastModified: Date.now() });
              localStorage.setItem('potato_projects_index', JSON.stringify(list.slice(0, 50))); // Cap at 50 for index
          } catch (e) {
              console.error("Auto-save failed", e);
          }
      };
      
      const timeoutId = setTimeout(saveProject, 1000); 
      return () => clearTimeout(timeoutId);
  }, [project]);

  const handleProjectCreate = (newProjectOrProjects: Project | Project[]) => {
      const projects = Array.isArray(newProjectOrProjects) ? newProjectOrProjects : [newProjectOrProjects];
      const indexStr = localStorage.getItem('potato_projects_index');
      let list = indexStr ? JSON.parse(indexStr) : [];

      projects.forEach(newProject => {
          localStorage.setItem(`potato_project_${newProject.id}`, JSON.stringify(newProject));
          list = list.filter((p: any) => p.id !== newProject.id);
          list.unshift({ id: newProject.id, name: newProject.name, lastModified: Date.now() });
      });

      localStorage.setItem('potato_projects_index', JSON.stringify(list));
      if (projects.length > 0) setProject(projects[0]);
  };

  return { project, setProject, handleProjectCreate };
};