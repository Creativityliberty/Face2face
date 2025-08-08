
import React, { useState, useRef, useEffect } from 'react';
import { VolumeX, VolumeUp, PhotoIcon } from './icons';
import { type Media } from '../types';

interface MediaViewerProps {
    media: Media;
    isWelcomeScreen: boolean;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ media, isWelcomeScreen }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const hasValidMediaUrl = media && media.url && media.url.trim() !== '';

  useEffect(() => {
    setIsMuted(isWelcomeScreen || media.type !== 'video');
  }, [isWelcomeScreen, media.type]);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if(videoRef.current) {
        videoRef.current.play().catch(error => console.error("Video play failed", error));
    }
  };

  const renderMediaContent = () => {
    switch(media.type) {
      case 'image':
        return <img key={media.url} src={media.url} alt="Step background" className="absolute top-0 left-0 w-full h-full object-cover" />;
      case 'audio':
        return (
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-black">
            <audio key={media.url} controls autoPlay src={media.url} className="w-full max-w-sm">
                Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'video':
      default:
        return (
            <video
                ref={videoRef}
                key={media.url}
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={media.url}
                autoPlay
                loop
                playsInline
                muted={isMuted}
            />
        );
    }
  }

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-screen bg-black">
      {hasValidMediaUrl ? renderMediaContent() : (
        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-white text-center p-4">
            <PhotoIcon className="w-16 h-16 text-gray-500 mb-4" />
            <p className="font-semibold text-lg">No media source provided</p>
            <p className="text-sm text-gray-400 mt-1">Enter a URL in the builder to preview.</p>
        </div>
      )}
      
      {hasValidMediaUrl && <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>}
      
      {hasValidMediaUrl && media.type === 'video' && isWelcomeScreen && (
         <div className="absolute inset-0 flex items-center justify-center">
             <button
                onClick={toggleMute}
                className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
                {isMuted ? <VolumeX className="w-12 h-12" /> : <VolumeUp className="w-12 h-12" />}
            </button>
         </div>
      )}

      {hasValidMediaUrl && media.type === 'video' && !isWelcomeScreen && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 bg-transparent rounded-full flex items-center justify-center text-white/50" >
                <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"></path>
                </svg>
            </div>
         </div>
      )}
    </div>
  );
};
