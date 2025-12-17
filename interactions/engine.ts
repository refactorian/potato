import { Interaction, Project } from '../types';

interface InteractionContext {
  project: Project;
  setProject: (project: Project) => void;
  navigate: (screenId: string) => void;
}

export const executeInteraction = (
  interaction: Interaction,
  context: InteractionContext
) => {
  switch (interaction.action) {
    case 'navigate':
      if (interaction.payload) {
        context.navigate(interaction.payload);
      }
      break;
    case 'alert':
      alert(interaction.payload || 'Interaction triggered!');
      break;
    default:
      console.warn('Unknown interaction action:', interaction.action);
  }
};
