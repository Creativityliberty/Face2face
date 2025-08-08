import React, { useState, useMemo, useEffect } from 'react';
import { Button, Input, Textarea, Select, Card } from '../ui';
import { uploadMedia } from '../../src/lib/media';
// Removed useMediaStore - no more recent media library
import { 
  TrashIcon, 
  Bars3Icon, 
  PhotoIcon, 
  VideoCameraIcon, 
  MusicalNoteIcon, 
  SparklesIcon, 
  SpeakerWaveIcon 
} from '../icons';
import { suggestChangesForStep, generateAudioFromText, generateImageFromPrompt } from '../../src/lib/ai';
import { 
  type QuizStep, 
  type QuestionStep, 
  type LeadCaptureStep, 
  type Media, 
  type SocialLink, 
  type QuestionOption, 
  StepType 
} from '../../types';

interface StepEditorProps {
  step: QuizStep;
  allSteps: QuizStep[];
  onUpdate: (update: Partial<QuizStep>) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
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

const getStepName = (step: QuizStep, index: number) => {
  const typeName = getStepTypeName(step.type);
  const title = 'title' in step ? step.title : ('question' in step ? step.question : '');
  const truncatedTitle = title.length > 30 ? `${title.substring(0, 30)}...` : title;
  return `Step ${index + 1}: ${typeName} - "${truncatedTitle}"`;
};

export const StepEditor: React.FC<StepEditorProps> = ({
  step,
  allSteps,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnter
}) => {
  const [isSuggesting, setIsSuggesting] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [mediaTab, setMediaTab] = useState<'link' | 'ai'>('link');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleMediaUpdate = (key: keyof Media, value: any) => {
    onUpdate({ media: { ...step.media, [key]: value } });
  };

  const handleAISuggestion = async (field: string, currentValue: string) => {
    setIsSuggesting(field);
    try {
      const suggestion = await suggestChangesForStep(step, field, currentValue);
      if (suggestion) {
        onUpdate({ [field]: suggestion });
      }
    } catch (error) {
      console.error(`AI suggestion failed for field ${field}:`, error);
      alert("Sorry, the AI suggestion couldn't be generated right now.");
    } finally {
      setIsSuggesting(null);
    }
  };

  const handleGenerateAudio = async (text: string) => {
    if (!text || !text.trim()) {
      alert("Please enter some text before generating audio.");
      return;
    }
    setIsGeneratingAudio(true);
    try {
      const audioDataUrl = await generateAudioFromText(text);
      onUpdate({ media: { type: 'audio', url: audioDataUrl } });
    } catch (error) {
      console.error("Audio generation failed:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      alert(`Sorry, audio generation failed. ${message}`);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setImageError("Please enter a description for the image.");
      return;
    }
    setIsGeneratingImage(true);
    setImageError(null);
    try {
      const imageDataUrl = await generateImageFromPrompt(imagePrompt);
      onUpdate({ media: { type: 'image', url: imageDataUrl } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Image generation failed:", error);
      setImageError(`Image generation failed: ${message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const renderAIActions = (field: 'title' | 'subtitle' | 'question', value: string) => (
    <div className="flex flex-col space-y-2 ml-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAISuggestion(field, value)}
        disabled={isSuggesting === field || isGeneratingAudio || isGeneratingImage}
        title="Suggest with AI"
      >
        <SparklesIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleGenerateAudio(value)}
        disabled={isGeneratingAudio || !!isSuggesting || isGeneratingImage}
        loading={isGeneratingAudio}
        title="Generate Audio with AI"
      >
        <SpeakerWaveIcon className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderFields = () => {
    switch(step.type) {
      case StepType.Welcome:
      case StepType.Message:
        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="flex-grow">
                <Input
                  label="Title"
                  value={step.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  disabled={!!isSuggesting || isGeneratingAudio || isGeneratingImage}
                />
              </div>
              {renderAIActions('title', step.title)}
            </div>
            <Input
              label="Button Text"
              value={step.buttonText}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
            />
          </div>
        );

      case StepType.LeadCapture:
        const leadStep = step as LeadCaptureStep;
        
        const handleSocialLinkChange = (id: string, field: 'type' | 'url', value: string) => {
          const updatedLinks = (leadStep.socialLinks || []).map(link => 
            link.id === id ? { ...link, [field]: value } : link
          );
          onUpdate({ socialLinks: updatedLinks });
        };

        const addSocialLink = () => {
          const newLink: SocialLink = { id: `social-${Date.now()}`, type: 'website', url: '' };
          const updatedLinks = [...(leadStep.socialLinks || []), newLink];
          onUpdate({ socialLinks: updatedLinks });
        };

        const deleteSocialLink = (id: string) => {
          const updatedLinks = (leadStep.socialLinks || []).filter(link => link.id !== id);
          onUpdate({ socialLinks: updatedLinks });
        };

        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="flex-grow">
                <Input
                  label="Title"
                  value={leadStep.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  disabled={!!isSuggesting || isGeneratingAudio || isGeneratingImage}
                />
              </div>
              {renderAIActions('title', leadStep.title)}
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="flex-grow">
                <Textarea
                  label="Subtitle"
                  value={leadStep.subtitle}
                  onChange={(e) => onUpdate({ subtitle: e.target.value })}
                  disabled={!!isSuggesting || isGeneratingAudio || isGeneratingImage}
                />
              </div>
              {renderAIActions('subtitle', leadStep.subtitle)}
            </div>

            <Input
              label="Name Field Placeholder"
              value={leadStep.namePlaceholder}
              onChange={(e) => onUpdate({ namePlaceholder: e.target.value })}
            />
            
            <Input
              label="Email Field Placeholder"
              value={leadStep.emailPlaceholder}
              onChange={(e) => onUpdate({ emailPlaceholder: e.target.value })}
            />
            
            <Input
              label="Phone Field Placeholder"
              value={leadStep.phonePlaceholder}
              onChange={(e) => onUpdate({ phonePlaceholder: e.target.value })}
            />
            
            <Input
              label="Button Text"
              value={leadStep.buttonText}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
            />
            
            <Textarea
              label="Subscription Checkbox Text"
              value={leadStep.subscriptionText}
              onChange={(e) => onUpdate({ subscriptionText: e.target.value })}
            />
            
            <Input
              label="Privacy Policy URL"
              value={leadStep.privacyPolicyUrl}
              onChange={(e) => onUpdate({ privacyPolicyUrl: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Social Links</label>
              <div className="space-y-3">
                {(leadStep.socialLinks || []).map(link => (
                  <div key={link.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Select
                      value={link.type}
                      onChange={(e) => handleSocialLinkChange(link.id, 'type', e.target.value)}
                    >
                      <option value="website">Website</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">X (Twitter)</option>
                    </Select>
                    <Input
                      value={link.url}
                      placeholder="https://..."
                      onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSocialLink(link.id)}
                      className="flex-shrink-0"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addSocialLink} className="w-full">
                  + Add social link
                </Button>
              </div>
            </div>
          </div>
        );

      case StepType.Question:
        const questionStep = step as QuestionStep;
        
        const handleOptionChange = (index: number, field: keyof QuestionOption, value: string) => {
          const newOptions = (questionStep.options || []).map((opt, i) => 
            i === index ? { ...opt, [field]: value } : opt
          );
          onUpdate({ options: newOptions });
        };

        const addOption = () => {
          const newOption: QuestionOption = { 
            id: `opt-${step.id}-${Date.now()}`, 
            text: `New Option ${(questionStep.options?.length || 0) + 1}`
          };
          const newOptions = [...(questionStep.options || []), newOption];
          onUpdate({ options: newOptions });
        };

        const deleteOption = (index: number) => {
          const newOptions = (questionStep.options || []).filter((_, i) => i !== index);
          onUpdate({ options: newOptions });
        };

        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="flex-grow">
                <Input
                  label="Question"
                  value={questionStep.question}
                  onChange={(e) => onUpdate({ question: e.target.value })}
                  disabled={!!isSuggesting || isGeneratingAudio || isGeneratingImage}
                />
              </div>
              {renderAIActions('question', questionStep.question)}
            </div>

            <Select
              label="Answer Input Type"
              value={questionStep.answerInput.type}
              onChange={(e) => onUpdate({ answerInput: { type: e.target.value } })}
            >
              <option value="buttons">Buttons</option>
              <option value="text">Text Input</option>
              <option value="voice">Voice Recording</option>
              <option value="video">Video Recording</option>
            </Select>

            {questionStep.answerInput.type === 'buttons' && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Options</label>
                <div className="space-y-3">
                  {(questionStep.options || []).map((option, index) => (
                    <Card key={option.id} padding="sm" className="bg-gray-50">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                            placeholder="Option text"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteOption(index)}
                            className="flex-shrink-0"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        <Select
                          label="Then, jump to..."
                          value={option.nextStepId || ''}
                          onChange={(e) => handleOptionChange(index, 'nextStepId', e.target.value)}
                        >
                          <option value="">Default (Next Step)</option>
                          {allSteps.filter(s => s.id !== step.id).map((s) => (
                            <option key={s.id} value={s.id}>
                              {getStepName(s, allSteps.findIndex(as => as.id === s.id))}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addOption} className="w-full">
                    + Add option
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      className="cursor-move"
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <Bars3Icon className="w-5 h-5 text-gray-400 cursor-grab" />
          <h3 className="font-semibold text-gray-700">{getStepTypeName(step.type)}</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          title="Delete Step"
        >
          <TrashIcon className="w-5 h-5" />
        </Button>
      </div>

      {renderFields()}

      {/* Media Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-600 mb-3">Step Media</label>
        
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setMediaTab('link')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mediaTab === 'link' 
                ? 'border-b-2 border-brand-rose text-brand-rose' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Link
          </button>
          <button
            onClick={() => setMediaTab('ai')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mediaTab === 'ai' 
                ? 'border-b-2 border-brand-rose text-brand-rose' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Generate with AI
          </button>
        </div>

        {mediaTab === 'link' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Select
                value={step.media.type}
                onChange={(e) => handleMediaUpdate('type', e.target.value)}
              >
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </Select>
              <div className="p-2.5 bg-white border border-gray-300 rounded-lg">
                {step.media.type === 'video' && <VideoCameraIcon className="w-5 h-5 text-gray-500" />}
                {step.media.type === 'image' && <PhotoIcon className="w-5 h-5 text-gray-500" />}
                {step.media.type === 'audio' && <MusicalNoteIcon className="w-5 h-5 text-gray-500" />}
              </div>
            </div>
            
            <Input
              value={step.media.url}
              onChange={(e) => handleMediaUpdate('url', e.target.value)}
              placeholder="https://example.com/media.mp4"
            />
            {/* File upload - Images and Audio only */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Upload Media (Images & Audio)
              </label>
              <input
                type="file"
                accept="image/*,audio/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // Determine MediaType from MIME
                  let type: MediaType = 'image';
                  if (file.type.startsWith('audio')) type = 'audio';
                  try {
                    const url = await uploadMedia(file, type);
                    handleMediaUpdate('url', url);
                    handleMediaUpdate('type', type);
                    // Media uploaded successfully - no more recent media store
                  } catch (err) {
                    console.error('Media upload failed', err);
                    alert('Failed to upload media');
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-rose file:text-white hover:file:bg-brand-rose-dark"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pour les vidéos, utilisez des liens YouTube ci-dessous
              </p>
            </div>
            
            {/* YouTube Video Section */}
            {step.media.type === 'video' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <label className="block text-sm font-medium text-red-700 mb-2">
                  🎥 Lien YouTube
                </label>
                <Input
                  value={step.media.url}
                  onChange={(e) => handleMediaUpdate('url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mb-2"
                />
                <p className="text-xs text-red-600">
                  Collez l'URL complète de votre vidéo YouTube
                </p>
              </div>
            )}
            
            {/* Recent media section removed - simplified media handling */}
            {/* Media preview */}
            {step.media.url && (
              <div className="mt-4">
                {step.media.type === 'image' && (
                  <img src={step.media.url} alt="Media preview" className="max-w-full h-auto rounded" />
                )}
                {step.media.type === 'video' && (
                  <video src={step.media.url} controls className="max-w-full rounded" />
                )}
                {step.media.type === 'audio' && (
                  <audio src={step.media.url} controls className="w-full" />
                )}
              </div>
            )}
          </div>
        )}

        {mediaTab === 'ai' && (
          <div className="space-y-3">
            <Textarea
              label="Describe the image you want"
              placeholder="e.g., A minimalist, sunlit office with a single green plant."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              disabled={isGeneratingImage}
            />
            
            <Button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !imagePrompt}
              loading={isGeneratingImage}
              className="w-full"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isGeneratingImage ? 'Generating Image...' : 'Generate Image'}
            </Button>
            
            {imageError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{imageError}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};