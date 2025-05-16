import React, { useRef, useState } from "react";

interface VoiceInputProps {
  onResult: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      setListening(false);
      alert("Speech recognition error: " + event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecognition = () => {
    recognitionRef.current && recognitionRef.current.stop();
    setListening(false);
  };

  return (
    <button
      type="button"
      onClick={listening ? stopRecognition : startRecognition}
      aria-label={listening ? "Stop recording" : "Speak your question"}
      style={{ marginLeft: 8, fontSize: 22, cursor: "pointer" }}
    >
      {listening ? "🛑" : "🎤"}
    </button>
  );
};

export default VoiceInput;