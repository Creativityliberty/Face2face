import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui';
import { VideoCameraIcon, MusicalNoteIcon, StopIcon, ArrowPathIcon } from '../icons';

type RecordingStatus = 'idle' | 'permission_denied' | 'error' | 'recording' | 'preview';

interface MediaRecorderProps {
  type: 'video' | 'voice';
  onSubmit: (data: { type: string; url: string }) => void;
}

export const MediaRecorder: React.FC<MediaRecorderProps> = ({ type, onSubmit }) => {
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const isVideo = type === 'video';

  useEffect(() => {
    // Cleanup function to stop media streams when component unmounts
    return () => {
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    if (videoPreviewRef.current && mediaStreamRef.current) {
      videoPreviewRef.current.srcObject = mediaStreamRef.current;
    }
  }, [recordingStatus]);

  const handleStartRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: isVideo,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { 
          type: isVideo ? 'video/webm' : 'audio/webm' 
        });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        setRecordingStatus('preview');
      };
      
      mediaRecorderRef.current.start();
      setRecordingStatus('recording');

    } catch (err) {
      console.error("Error accessing media devices.", err);
      setRecordingStatus('permission_denied');
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
  };

  const handleRerecord = () => {
    setRecordedBlobUrl(null);
    recordedChunksRef.current = [];
    setRecordingStatus('idle');
    handleStartRecording();
  };

  const handleSubmitRecording = () => {
    if (recordedBlobUrl) {
      onSubmit({
        type: type,
        url: recordedBlobUrl
      });
    }
  };

  if (recordingStatus === 'permission_denied') {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600">
          Camera/microphone access was denied. Please enable it in your browser settings to continue.
        </p>
      </div>
    );
  }

  if (recordingStatus === 'recording') {
    return (
      <div className="flex flex-col items-center space-y-6">
        {isVideo && (
          <video 
            ref={videoPreviewRef} 
            autoPlay 
            muted 
            className="w-full max-w-md rounded-lg bg-black shadow-lg" 
          />
        )}
        <div className="flex items-center space-x-3 text-brand-text">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="font-medium">Recording...</span>
        </div>
        <Button
          onClick={handleStopRecording}
          variant="secondary"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <StopIcon className="w-5 h-5 mr-2" />
          Stop Recording
        </Button>
      </div>
    );
  }

  if (recordingStatus === 'preview' && recordedBlobUrl) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <p className="font-semibold text-brand-text text-lg">Preview your answer:</p>
        {isVideo ? (
          <video 
            src={recordedBlobUrl} 
            controls 
            className="w-full max-w-md rounded-lg bg-black shadow-lg" 
          />
        ) : (
          <audio 
            src={recordedBlobUrl} 
            controls 
            className="w-full max-w-md" 
          />
        )}
        <div className="flex w-full max-w-md space-x-3">
          <Button
            onClick={handleRerecord}
            variant="secondary"
            className="flex-1"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Re-record
          </Button>
          <Button
            onClick={handleSubmitRecording}
            variant="primary"
            className="flex-1"
          >
            Submit Answer
          </Button>
        </div>
      </div>
    );
  }

  // Idle state
  return (
    <div className="text-center">
      <p className="text-brand-text/70 mb-6">
        Click the button to record your {isVideo ? 'video' : 'voice'} answer.
      </p>
      <Button
        onClick={handleStartRecording}
        variant="primary"
        size="lg"
        className="rounded-full"
      >
        {isVideo ? <VideoCameraIcon className="w-6 h-6 mr-3" /> : <MusicalNoteIcon className="w-6 h-6 mr-3" />}
        Record {isVideo ? 'Video' : 'Voice'}
      </Button>
    </div>
  );
};