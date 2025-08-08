import React, { useState } from 'react';
import { Button, Textarea, Select } from '../ui';
import { SparklesIcon } from '../icons';
import { generateFunnelFromPrompt } from '../../lib/ai';
import { type QuizConfig } from '../../types';

interface AIAssistantProps {
  setConfig: (config: QuizConfig) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ setConfig }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<'gemini-2.5-pro' | 'gemini-2.5-flash'>('gemini-2.5-pro');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    try {
      const newConfig = await generateFunnelFromPrompt(prompt, model);
      setConfig(newConfig);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate funnel. ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        label="Describe your funnel goal"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A funnel for a fitness coach to help clients with nutrition."
        disabled={isLoading}
        rows={4}
      />
      
      <Select
        label="Select AI Model"
        value={model}
        onChange={(e) => setModel(e.target.value as 'gemini-2.5-pro' | 'gemini-2.5-flash')}
        disabled={isLoading}
      >
        <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highest Quality)</option>
        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest)</option>
      </Select>

      <Button
        onClick={handleGenerate}
        disabled={isLoading || !prompt}
        loading={isLoading}
        className="w-full"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        {isLoading ? 'Generating...' : 'Generate with AI'}
      </Button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};