// String formatting functions for the builder component
import { StepType, type QuizStep } from '../types';

export const formatStepTypeName = (type: StepType): string => {
  switch(type) {
    case StepType.Welcome: return 'Welcome';
    case StepType.Question: return 'Question';
    case StepType.Message: return 'Message';
    case StepType.LeadCapture: return 'Lead Capture';
    default: return 'Step';
  }
};

export const formatStepName = (step: QuizStep, index: number): string => {
  const typeName = formatStepTypeName(step.type);
  const title = 'title' in step ? step.title : ('question' in step ? step.question : '');
  const truncatedTitle = title.length > 30 ? `${title.substring(0, 30)}...` : title;
  return `Step ${index + 1}: ${typeName} - "${truncatedTitle}"`;
};

export const formatMediaFileName = (url: string): string => {
  return url.substring(url.lastIndexOf('/') + 1);
};