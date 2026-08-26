import React, { useEffect } from "react"

const AudioNative = ({
  publicUserId = "36d96927eb49029bd258c8a7138932b6afc7aca35d504f2986ff830522c11bd8",
  height = "90",
  width = "100%",
}) => {
  useEffect(() => {
    // Create and load the script
    const script = document.createElement("script")
    script.src = "https://elevenlabs.io/player/audioNativeHelper.js"
    script.type = "text/javascript"

    // Only add the script if it hasn't been added before
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.body.appendChild(script)
    }

    // No cleanup needed since we want the script to persist
  }, [])

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
      Loading the{" "}
      <a
        href="https://elevenlabs.io/text-to-speech"
        target="_blank"
        rel="noopener noreferrer"
      >
        Elevenlabs Text to Speech
      </a>{" "}
      AudioNative Player...
    </div>
  )
}

export default AudioNative
