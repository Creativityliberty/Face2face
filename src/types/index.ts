// Enums for the funnel builder component
import type { DragEvent, ReactNode, ElementType, ChangeEvent } from 'react';
export enum StepType {
  Welcome = 0,
  Question = 1,
  Message = 2,
  LeadCapture = 3
}

export enum MediaType {
  Video = 'video',
  Image = 'image', 
  Audio = 'audio'
}

export enum SocialLinkType {
  Website = 'website',
  WhatsApp = 'whatsapp',
  YouTube = 'youtube',
  Instagram = 'instagram',
  Facebook = 'facebook',
  Twitter = 'twitter'
}

export enum AnswerInputType {
  Buttons = 'buttons',
  Text = 'text',
  Voice = 'voice',
  Video = 'video'
}

export enum AIModel {
  GeminiPro = 'gemini-2.5-pro',
  GeminiFlash = 'gemini-2.5-flash'
}

// Type definitions for the funnel builder component
export interface BuilderProps {
  config: QuizConfig;
  setConfig: (config: QuizConfig) => void;
}

export interface StepEditorProps {
  step: QuizStep;
  allSteps: QuizStep[];
  onUpdate: (update: Partial<QuizStep>) => void;
  onDelete: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent) => void;
}

export interface ThemeEditorProps {
  theme: ThemeConfig;
  onUpdate: (theme: ThemeConfig) => void;
}

export interface AIAssistantProps {
  setConfig: (config: QuizConfig) => void;
}

export interface ShareAndEmbedProps {
  config: QuizConfig;
}

export interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export interface InputFieldProps {
  label?: string;
  icon?: ElementType;
  onIconClick?: () => void;
  [key: string]: any;
}

export interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Core data types
export interface QuizConfig {
  steps: QuizStep[];
  theme: ThemeConfig;
  redirectUrl?: string;
  whatsappNumber?: string; // international format, digits only recommended
}

export interface QuizStep {
  id: string;
  type: StepType;
  media: Media;
}

export interface WelcomeStep extends QuizStep {
  type: StepType.Welcome;
  title: string;
  buttonText: string;
}

export interface MessageStep extends QuizStep {
  type: StepType.Message;
  title: string;
  buttonText: string;
}

export interface QuestionStep extends QuizStep {
  type: StepType.Question;
  question: string;
  answerInput: AnswerInput;
  options?: QuestionOption[];
}

export interface LeadCaptureStep extends QuizStep {
  type: StepType.LeadCapture;
  title: string;
  subtitle: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  subscriptionText: string;
  privacyPolicyUrl: string;
  buttonText: string;
  socialLinks?: SocialLink[];
}

export interface Media {
  type: MediaType;
  url: string;
}

export interface AnswerInput {
  type: AnswerInputType;
}

export interface QuestionOption {
  id: string;
  text: string;
  nextStepId?: string;
}

export interface SocialLink {
  id: string;
  type: SocialLinkType;
  url: string;
}

export interface ThemeConfig {
  colors: {
    background: string;
    primary: string;
    accent: string;
    text: string;
    buttonText: string;
  };
  font: string;
}