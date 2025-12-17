
import { Interaction, Project } from '../types';

interface InteractionContext {
  project: Project;
  setProject: (project: Project) => void;
  navigate: (screenId: string) => void;
  goBack: () => void;
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
    case 'back':
      context.goBack();
      break;
    case 'alert':
      alert(interaction.payload || 'Action triggered!');
      break;
    case 'url':
      if (interaction.payload) {
        window.open(interaction.payload, '_blank', 'noopener,noreferrer');
      }
      break;
    case 'none':
      // Do nothing
      break;
    default:
      console.warn('Unknown interaction action:', interaction.action);
  }
};
