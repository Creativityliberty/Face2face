// Builder.tsx - Main funnel builder component
import React from 'react';
import { BuilderProps, StepType, QuizConfig, QuizStep, WelcomeStep, MessageStep, QuestionStep, LeadCaptureStep } from '../src/types';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { AIAssistant } from './builder/AIAssistant';
import { ThemeEditor } from './builder/ThemeEditor';
import { StepEditor } from './builder/StepEditor';
import { ShareAndEmbed } from './builder/ShareAndEmbed';
import { Select, Button, Input } from './ui';

// Helper to create a new step based on selected type
const createNewStep = (type: StepType): QuizStep => {
  const base = { id: `step-${Date.now()}`, type, media: { type: 'image' as const, url: '' } } as QuizStep;
  switch (type) {
    case StepType.Welcome:
      return { ...base, type, title: 'Welcome', buttonText: 'Start' } as WelcomeStep;
    case StepType.Message:
      return { ...base, type, title: 'Message', buttonText: 'Continue' } as MessageStep;
    case StepType.Question:
      return {
        ...base,
        type,
        question: 'Your question?',
        answerInput: { type: 'buttons' },
        options: []
      } as QuestionStep;
    case StepType.LeadCapture:
      return {
        ...base,
        type,
        title: 'Join us',
        subtitle: '',
        namePlaceholder: 'Name',
        emailPlaceholder: 'Email',
        phonePlaceholder: 'Phone',
        subscriptionText: '',
        privacyPolicyUrl: '',
        buttonText: 'Submit',
        socialLinks: []
      } as LeadCaptureStep;
    default:
      return base;
  }
};

export const Builder: React.FC<BuilderProps> = ({ config, setConfig }) => {
  // Handlers for step operations
  const updateStep = (index: number, update: Partial<QuizStep>) => {
    const newSteps = [...config.steps];
    newSteps[index] = { ...newSteps[index], ...update } as QuizStep;
    setConfig({ ...config, steps: newSteps });
  };

  const deleteStep = (index: number) => {
    const newSteps = config.steps.filter((_, i) => i !== index);
    setConfig({ ...config, steps: newSteps });
  };

  const reorderSteps = (draggedId: string, targetId: string) => {
    const fromIdx = config.steps.findIndex(s => s.id === draggedId);
    const toIdx = config.steps.findIndex(s => s.id === targetId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const newSteps = [...config.steps];
    const [moved] = newSteps.splice(fromIdx, 1);
    newSteps.splice(toIdx, 0, moved);
    setConfig({ ...config, steps: newSteps });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== id) {
      reorderSteps(draggedId, id);
    }
  };

  // Add step UI state
  const [newStepType, setNewStepType] = React.useState<StepType>(StepType.Welcome);
  const addStep = () => {
    const newStep = createNewStep(newStepType);
    setConfig({ ...config, steps: [...config.steps, newStep] });
  };

  // Theme update handler
  const updateTheme = (theme: QuizConfig['theme']) => {
    setConfig({ ...config, theme });
  };

  // Funnel settings update handlers
  const updateWhatsAppNumber = (value: string) => {
    setConfig({ ...config, whatsappNumber: value });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 overflow-y-auto">
      {/* AI Assistant Section */}
      <CollapsibleSection title="AI Assistant" defaultOpen={false}>
        <AIAssistant setConfig={setConfig} />
      </CollapsibleSection>

      {/* Theme Editor Section */}
      <CollapsibleSection title="Theme Editor" defaultOpen={false}>
        <ThemeEditor theme={config.theme} onUpdate={updateTheme} />
      </CollapsibleSection>

      {/* Steps Management Area */}
      <CollapsibleSection title="Steps Management" defaultOpen={true}>
        <div className="space-y-4">
          {config.steps.map((step, idx) => (
            <div
              key={step.id}
              draggable
              onDragStart={(e) => handleDragStart(e, step.id)}
              onDragEnter={(e) => handleDragEnter(e, step.id)}
              className="border border-gray-200 rounded-lg p-2 bg-white"
            >
              <StepEditor
                step={step}
                allSteps={config.steps}
                onUpdate={(upd) => updateStep(idx, upd)}
                onDelete={() => deleteStep(idx)}
                onDragStart={(e) => handleDragStart(e, step.id)}
                onDragEnter={(e) => handleDragEnter(e, step.id)}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Add Step Section */}
      <CollapsibleSection title="Add New Step" defaultOpen={false}>
        <div className="flex items-center space-x-2 border-dashed border-2 border-gray-300 p-4 rounded">
          <Select
            label="Step Type"
            value={newStepType}
            onChange={(e) => setNewStepType(Number(e.target.value) as StepType)}
          >
            <option value={StepType.Welcome}>Welcome</option>
            <option value={StepType.Question}>Question</option>
            <option value={StepType.Message}>Message</option>
            <option value={StepType.LeadCapture}>Lead Capture</option>
          </Select>
          <Button onClick={addStep} variant="primary">
            Add Step
          </Button>
        </div>
      </CollapsibleSection>

      {/* Funnel Settings */}
      <CollapsibleSection title="Funnel Settings" defaultOpen={false}>
        <div className="space-y-4">
          <Input
            label="WhatsApp Number (international format)"
            placeholder="e.g. +14155550123"
            value={(config as any).whatsappNumber || ''}
            onChange={(e) => updateWhatsAppNumber(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            After a lead is captured, users will be redirected automatically to this WhatsApp number in 3 seconds. Use an international number (with country code). Non-digit characters will be ignored when generating the link.
          </p>
        </div>
      </CollapsibleSection>

      {/* Share & Embed Section */}
      <CollapsibleSection title="Share & Embed" defaultOpen={false}>
        <ShareAndEmbed config={config} />
      </CollapsibleSection>
    </div>
  );
};
