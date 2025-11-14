import { GoogleGenAI } from "@google/genai";
import { type QuizConfig, type QuizStep, StepType, QuestionOption, SocialLink } from '../types';

/**
 * ⚠️ DEPRECATED: This file is no longer used for security reasons.
 *
 * Client-side AI generation exposed the API key to the browser, allowing
 * anyone to steal and abuse it.
 *
 * ✅ NEW: Use generateFunnelFromBackend() from lib/api.ts instead
 *
 * This keeps the API key secure on the backend and proxies requests
 * through /api/ai/generate-funnel.
 *
 * This file is kept for reference only and may be removed in the future.
 */

// DEPRECATED: API key should NEVER be in client-side code
if (!process.env.API_KEY) {
    console.warn("⚠️ DEPRECATED: Client-side AI generation is no longer used. Use backend endpoint instead.");
}
const ai = new GoogleGenAI({apiKey: process.env.API_KEY || 'deprecated'});

const parseJsonResponse = <T>(jsonString: string): T => {
    let cleanJsonString = jsonString.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonString.match(fenceRegex);
    if (match && match[2]) {
        cleanJsonString = match[2].trim();
    }

    try {
        return JSON.parse(cleanJsonString);
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.error("Original string:", jsonString);
        throw new Error("The AI returned an invalid response format. Please try again.");
    }
}

const typeDefinitions = `
// TYPE DEFINITIONS FOR THE FUNNEL CONFIGURATION

export enum StepType {
  Welcome,
  Question,
  Message,
  LeadCapture,
}

export type MediaType = 'image' | 'video' | 'audio';
export interface Media {
  type: MediaType;
  url: string; // Must be a valid, public, royalty-free URL (e.g., from pexels.com, pixabay.com)
}

export type AnswerInputType = 'buttons' | 'text' | 'voice' | 'video';
export interface AnswerInput {
  type: AnswerInputType;
}

export interface WelcomeStep {
  id: string; // e.g., "step-1"
  type: StepType.Welcome;
  title: string;
  buttonText: string;
  media: Media;
}

export interface QuestionOption {
  id: string; // e.g., "opt-1-1"
  text: string;
  nextStepId?: string; // Optional: ID of the step to jump to. If omitted, goes to next step.
}

export interface QuestionStep {
  id:string;
  type: StepType.Question;
  question: string;
  answerInput: AnswerInput;
  options?: QuestionOption[];
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
  id: string; // e.g., "social-1"
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

export interface ThemeConfig {
  font: string; // e.g., 'Poppins'
  colors: {
    background: string; // hex
    primary: string; // hex
    accent: string; // hex
    text: string; // hex
    buttonText: string; // hex
  };
}

export interface QuizConfig {
  steps: QuizStep[];
  theme: ThemeConfig;
}
`;

/**
 * Retry helper for API calls with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Si c'est une erreur "overloaded" (503), retry
      if (error?.error?.code === 503 || error?.error?.status === 'UNAVAILABLE') {
        const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`API overloaded, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Pour les autres erreurs, throw immédiatement
      throw error;
    }
  }

  throw lastError || new Error('Max retries reached');
}

export async function generateFunnelFromPrompt(prompt: string, model: 'gemini-2.5-pro' | 'gemini-2.5-flash' = 'gemini-2.5-pro'): Promise<QuizConfig> {
    if (!process.env.API_KEY) {
        throw new Error("API Key is not configured. Cannot use AI features.");
    }

    const systemInstruction = `
        You are an expert in marketing, psychology, and instructional design.
        Your task is to create a complete, interactive quiz funnel configuration based on a user's prompt.
        The output MUST be a single, valid JSON object that conforms to the 'QuizConfig' TypeScript interface provided below.
        DO NOT include any text, explanation, or markdown formatting outside of the JSON object.

        GUIDELINES:
        1.  **Understand the Goal:** Deeply analyze the user's prompt to understand the target audience and the desired outcome of the funnel.
        2.  **Create a Compelling Flow:** Design a logical sequence of steps (up to 15 maximum) that guide the user on a journey of self-discovery, leading them naturally to the lead capture form. The number of steps should depend on the subject complexity and user needs. Start with a Welcome step, use a mix of Question and Message steps, and end with a LeadCapture step.
        3.  **Engaging Content:** Write compelling, empathetic, and clear text for all titles, questions, and options.
        4.  **Unique IDs:** Ensure ALL 'id' fields throughout the entire JSON object are unique strings (e.g., "step-1", "opt-1-1", "social-1"). This is critical.
        5.  **Media Suggestions:** For each step's 'media' property, provide a valid, public, royalty-free URL from Pexels (e.g., https://videos.pexels.com/...) or Pixabay. Choose media that is visually appealing and relevant to the step's content.
        6.  **Thematic Design:** Create a 'theme' object with a font from Google Fonts and a harmonious color palette that matches the mood of the funnel.
        7.  **Final Output:** The entire response must be ONLY the JSON object.

        ${typeDefinitions}
    `;

    // Retry avec backoff en cas de surcharge API
    const response = await retryWithBackoff(
      async () => await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: 'application/json'
        }
      }),
      3, // 3 tentatives
      2000 // Commence à 2 secondes
    );

    return parseJsonResponse<QuizConfig>(response.text);
}

export async function suggestChangesForStep(step: QuizStep, field: string, currentValue: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API Key is not configured. Cannot use AI features.");
    }

    const prompt = `
        You are an expert copywriter specializing in creating engaging micro-copy for interactive funnels.
        A user is building a quiz step and wants a better suggestion for a specific text field.

        The current step is of type: "${getStepTypeName(step.type)}"
        The field to improve is: "${String(field)}"
        The current text is: "${currentValue}"

        Based on this context, generate a more compelling, clear, or empathetic version of the text.
        Your response MUST be a single, valid JSON object with one key: "suggestion".

        Example Response:
        {
            "suggestion": "A new, improved version of the text."
        }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    const parsed = parseJsonResponse<{ suggestion: string }>(response.text);
    return parsed.suggestion;
}

export async function generateAudioFromText(text: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API Key is not configured. Cannot use AI features.");
    }
    if (!text.trim()) {
        throw new Error("Cannot generate audio from empty text.");
    }

    const systemInstruction = `
        You are a Text-to-Speech (TTS) service.
        Your task is to convert the user's text prompt into high-quality audio.
        The output MUST be a single, valid JSON object with one key: "audioContent".
        The value of "audioContent" must be the BASE64 encoded string of the generated audio file.
        DO NOT include any other text, explanation, or markdown formatting.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: `Generate audio for this text: "${text}"`,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
        }
    });

    const parsed = parseJsonResponse<{ audioContent: string }>(response.text);
    
    if (!parsed.audioContent) {
        throw new Error("AI response did not contain audio content.");
    }

    return `data:audio/mpeg;base64,${parsed.audioContent}`;
}

export async function generateImageFromPrompt(prompt: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API Key is not configured. Cannot use AI features.");
    }
    if (!prompt.trim()) {
        throw new Error("Cannot generate image from empty prompt.");
    }

    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {numberOfImages: 1, outputMimeType: 'image/jpeg'},
    });
    
    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("AI response did not contain any images.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    
    if (!base64ImageBytes) {
        throw new Error("Generated image data is empty.");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;
}


const getStepTypeName = (type: StepType) => {
    switch(type) {
        case StepType.Welcome: return 'Welcome';
        case StepType.Question: return 'Question';
        case StepType.Message: return 'Message';
        case StepType.LeadCapture: return 'Lead Capture';
        default: return 'Step';
    }
};