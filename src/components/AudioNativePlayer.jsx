import React, { useEffect } from 'react';

const AudioNativePlayer = ({ publicUserId, height = '90', width = '100%' }) => {
  useEffect(() => {
    // Create and load the script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/player/audioNativeHelper.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="elevenlabs-audionative-widget"
      data-height={height}
      data-width={width}
      data-frameborder="no"
      data-scrolling="no"
      data-publicuserid={publicUserId}
      data-playerurl="https://elevenlabs.io/player/index.html"
    >
      Loading the{' '}
      <a
        href="https://elevenlabs.io/text-to-speech"
        target="_blank"
        rel="noopener noreferrer"
      >
        Elevenlabs Text to Speech
      </a>{' '}
      AudioNative Player...
    </div>
  );
};

export default AudioNativePlayer; 