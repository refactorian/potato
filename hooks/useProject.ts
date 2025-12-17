
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../types';

const INITIAL_PROJECT: Project = {
  id: uuidv4(),
  name: 'New Project',
  projectType: 'mobile',
  tags: [],
  lastModified: Date.now(),
  viewportWidth: 375,
  viewportHeight: 812,
  activeScreenId: 'screen-1',
  assets: [],
  screenGroups: [],
  gridConfig: {
    visible: true,
    size: 20,
    color: '#cbd5e1',
    snapToGrid: true,
  },
  screens: [
    {
      id: 'screen-1',
      name: 'Home Screen',
      backgroundColor: '#ffffff',
      elements: [],
    },
  ],
};

export const useProject = () => {
  const [project, setProject] = useState<Project>(() => {
      try {
          const indexStr = localStorage.getItem('potato_projects_index');
          if (indexStr) {
              const list = JSON.parse(indexStr);
              if (list.length > 0) {
                  const lastProject = list.sort((a: any, b: any) => b.lastModified - a.lastModified)[0];
                  const projectData = localStorage.getItem(`potato_project_${lastProject.id}`);
                  if (projectData) {
                      return JSON.parse(projectData);
                  }
              }
          }
      } catch (e) {
          console.error("Error loading initial project", e);
      }
      return INITIAL_PROJECT;
  });

  // Auto-Save Effect
  useEffect(() => {
      const saveProject = () => {
          try {
              localStorage.setItem(`potato_project_${project.id}`, JSON.stringify(project));
              
              const indexStr = localStorage.getItem('potato_projects_index');
              let list = indexStr ? JSON.parse(indexStr) : [];
              
              const newMeta = { id: project.id, name: project.name, lastModified: Date.now() };
              list = list.filter((p: any) => p.id !== project.id);
              list.unshift(newMeta);
              
              localStorage.setItem('potato_projects_index', JSON.stringify(list));
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
          
          const newMeta = { id: newProject.id, name: newProject.name, lastModified: Date.now() };
          list = list.filter((p: any) => p.id !== newProject.id);
          list.unshift(newMeta);
      });

      localStorage.setItem('potato_projects_index', JSON.stringify(list));

      if (projects.length > 0) {
          setProject(projects[0]);
      }
  };

  return { project, setProject, handleProjectCreate };
};
