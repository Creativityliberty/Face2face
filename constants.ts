import { type QuizConfig, StepType } from './types';

// Configuration limits
export const MAX_FUNNEL_STEPS = 15;
export const MIN_FUNNEL_STEPS = 1;

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  steps: [
    {
      id: 'step-1',
      type: StepType.Welcome,
      title: 'Uncover Your #1 Hidden Block to Inner Healing',
      buttonText: 'Find Out Now!',
      media: {
        type: 'video',
        url: 'https://videos.pexels.com/video-files/5782787/5782787-hd_1080_1920_25fps.mp4'
      }
    },
    {
      id: 'step-2',
      type: StepType.Question,
      question: "What's your biggest life challenge?",
      answerInput: { type: 'buttons' },
      options: [
        { id: 'opt-2-1', text: 'Repetitive Negative Beliefs' },
        { id: 'opt-2-2', text: 'Emotional Dysfunction (Sadness/Anxiety)' },
        { id: 'opt-2-3', text: 'Relational Dysfunction (Family, Work)' },
      ],
      media: {
        type: 'image',
        url: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    },
    {
      id: 'step-3',
      type: StepType.Message,
      title: 'You are NOT Alone!',
      buttonText: 'Continue',
      media: {
        type: 'audio',
        url: 'https://cdn.pixabay.com/download/audio/2022/02/21/audio_a4325a6a47.mp3'
      }
    },
    {
      id: 'step-4',
      type: StepType.Question,
      question: 'In one sentence, what holds you back MOST from healing?',
      answerInput: { type: 'text' },
      media: {
        type: 'image',
        url: 'https://images.pexels.com/photos/236171/pexels-photo-236171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
    },
    {
      id: 'step-5',
      type: StepType.Message,
      title: 'The #1 Killer of Women of Color...',
      buttonText: 'Continue',
      media: {
        type: 'video',
        url: 'https://videos.pexels.com/video-files/853874/853874-hd_1080_1920_30fps.mp4'
      }
    },
    {
      id: 'step-6',
      type: StepType.Question,
      question: 'What would your ideal support system be?',
      answerInput: { type: 'buttons' },
      options: [
        { id: 'opt-6-1', text: 'Self-Paced Programs' },
        { id: 'opt-6-2', text: 'Small Group Coaching' },
        { id: 'opt-6-3', text: 'Weekend Retreats' },
      ],
      media: {
        type: 'image',
        url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    },
    {
      id: 'step-7',
      type: StepType.LeadCapture,
      title: 'Hey Girl! Your Results are Ready!',
      subtitle: "Where should I send them to? Also note that if you enter your cell you are instantly the newest member of “The Hive” - our healing community!",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      phonePlaceholder: "Phone Number",
      subscriptionText: "Yes, Please subscribe me to other helpful content from Coach Steph.",
      privacyPolicyUrl: "#",
      buttonText: 'Send My Results!',
      socialLinks: [
        { id: 'social-1', type: 'instagram', url: '#' },
        { id: 'social-2', type: 'youtube', url: '#' }
      ],
      media: {
        type: 'video',
        url: 'https://videos.pexels.com/video-files/5782787/5782787-hd_1080_1920_25fps.mp4'
      }
    },
  ],
  theme: {
    font: 'Inter',
    colors: {
      background: '#D9CFC4',
      primary: '#A97C7C',
      accent: '#A11D1F',
      text: '#374151',
      buttonText: '#FFFFFF',
    }
  }
};