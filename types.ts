export enum StepType {
  Welcome,
  Question,
  Message,
  LeadCapture,
}

export type MediaType = 'image' | 'video' | 'audio';
export interface Media {
  type: MediaType;
  url: string;
}

export type AnswerInputType = 'buttons' | 'text' | 'voice' | 'video';
export interface AnswerInput {
  type: AnswerInputType;
}

export interface WelcomeStep {
  id: string;
  type: StepType.Welcome;
  title: string;
  buttonText: string;
  media: Media;
}

export interface QuestionOption {
  id: string;
  text: string;
  nextStepId?: string; // ID of the step to jump to
}

export interface QuestionStep {
  id:string;
  type: StepType.Question;
  question: string;
  answerInput: AnswerInput;
  options?: QuestionOption[]; // Only used when answerInput.type is 'buttons'
  media: Media;
}

export interface MessageStep {
  id: string;
  type: StepType.Message;
  title: string;
  buttonText: string;
  media: Media;
}

export interface SocialLink {
  id: string;
  type: 'whatsapp' | 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'website';
  url: string;
}

export interface LeadCaptureStep {
  id: string;
  type: StepType.LeadCapture;
  title: string;
  subtitle: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  subscriptionText: string;
  privacyPolicyUrl: string;
  buttonText: string;
  socialLinks: SocialLink[];
  media: Media;
}

export type QuizStep = WelcomeStep | QuestionStep | MessageStep | LeadCaptureStep;

export interface Answers {
  [key: string]: string | { type: 'voice' | 'video'; url: string }; // Support complex answers
}

export interface ThemeConfig {
  font: string;
  colors: {
    background: string;
    primary: string;
    accent: string;
    text: string;
    buttonText: string;
  };
}

export interface QuizConfig {
  steps: QuizStep[];
  theme: ThemeConfig;
  redirectUrl?: string; // URL de redirection après lead capture
  whatsappNumber?: string; // Numéro WhatsApp (international, chiffres uniquement) pour la redirection auto
  maxSteps?: number; // Limite du nombre d'étapes (défaut: 15)
}

// --- New Types for Results Dashboard ---

export interface AIAnalysisResult {
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    keywords: string[];
    summary: string;
}

export interface AnalyzedAnswer {
    questionId: string;
    questionText: string;
    answer: any; // Same as Answers value type
    analysis?: AIAnalysisResult;
}

export interface LeadCaptureStepData {
    name: string;
    email: string;
    phone: string;
    subscribed: boolean;
}

export interface Submission {
    id: string;
    timestamp: number;
    contactInfo: LeadCaptureStepData;
    analyzedAnswers: AnalyzedAnswer[];
}