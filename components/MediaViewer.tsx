import React, { useState, useRef, useEffect } from 'react';
import { VolumeX, VolumeUp, PhotoIcon } from './icons';
import { type Media } from '../types';

// YouTube Preview Component with Thumbnail and Play Button
interface YouTubePreviewProps {
  videoId: string;
  onPlay: () => void;
}

const YouTubePreview: React.FC<YouTubePreviewProps> = ({ videoId, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  const handlePlay = () => {
    setIsPlaying(true);
    onPlay();
  };
  
  // Auto-play after 3 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment next line for auto-play after 3 seconds
      // handlePlay();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isPlaying) {
    return (
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  
  return (
    <div 
      className="absolute inset-0 cursor-pointer group"
      onClick={handlePlay}
    >
      {/* YouTube Thumbnail */}
      <img 
        src={thumbnailUrl}
        alt="YouTube video thumbnail"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          // Fallback to default thumbnail if maxresdefault doesn't exist
          const target = e.target as HTMLImageElement;
          target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
      
      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-all duration-300 shadow-2xl">
          <svg 
            className="w-8 h-8 text-white ml-1" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      
      {/* YouTube Logo */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-black/80 px-2 py-1 rounded text-white text-xs font-semibold">
          YouTube
        </div>
      </div>
    </div>
  );
};

interface MediaViewerProps {
  media: Media;
  isWelcomeScreen?: boolean;
  className?: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ 
  media, 
  isWelcomeScreen = false,
  className = ""
}) => {
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
    if (videoRef.current) {
      // Only try to play if user has interacted
      videoRef.current.play().catch(error => {
        // Silently handle autoplay restrictions
        console.log("Video autoplay prevented - user interaction required");
      });
    }
  };

  const renderMediaContent = () => {
    if (!hasValidMediaUrl) {
      return (
        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-white text-center p-4">
          <PhotoIcon className="w-16 h-16 text-gray-500 mb-4" />
          <p className="font-semibold text-lg">No media source provided</p>
          <p className="text-sm text-gray-400 mt-1">Enter a URL in the builder to preview.</p>
        </div>
      );
    }

    switch(media.type) {
      case 'image':
        return (
          <img 
            key={media.url} 
            src={media.url} 
            alt="Step background" 
            className="absolute top-0 left-0 w-full h-full object-cover" 
          />
        );
      
      case 'audio':
        return (
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-purple-900 to-blue-900">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <audio 
                key={media.url} 
                controls 
                autoPlay 
                src={media.url} 
                className="w-full max-w-sm"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );
      
      case 'video':
      default:
        // Check if it's a YouTube URL
        const isYouTube = media.url.includes('youtube.com') || media.url.includes('youtu.be');
        
        if (isYouTube) {
          // Extract YouTube video ID
          const getYouTubeVideoId = (url: string) => {
            const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
            return match ? match[1] : null;
          };
          
          const videoId = getYouTubeVideoId(media.url);
          
          if (!videoId) {
            return (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white">
                <p>Invalid YouTube URL</p>
              </div>
            );
          }
          
          return (
            <YouTubePreview 
              videoId={videoId} 
              onPlay={() => {
                // This callback is handled by the YouTubePreview component itself
                console.log('YouTube video play requested');
              }}
            />
          );
        } else {
          // Regular video file
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
  };

  return (
    <div className={`relative w-full h-full min-h-[400px] bg-black overflow-hidden rounded-lg ${className}`}>
      {renderMediaContent()}
      
      {/* Overlay for better text readability */}
      {hasValidMediaUrl && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
      )}
      
      {/* Video controls for welcome screen */}
      {hasValidMediaUrl && media.type === 'video' && isWelcomeScreen && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={toggleMute}
            className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:bg-white/40"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-10 h-10" />
            ) : (
              <VolumeUp className="w-10 h-10" />
            )}
          </button>
        </div>
      )}

      {/* Play icon for non-welcome video screens */}
      {hasValidMediaUrl && media.type === 'video' && !isWelcomeScreen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white/70">
            <svg className="w-10 h-10 ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
