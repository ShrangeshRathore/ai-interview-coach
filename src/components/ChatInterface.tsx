import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageList from './MessageList';
import VoiceControls from './VoiceControls';
import InterviewerMode from './InterviewerMode';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleListening, speakText } = VoiceControls({
    onVoiceInput: handleVoiceInput,
    isListening,
    setIsListening,
  });

  useEffect(() => {
    const handleSampleQuestion = (event: CustomEvent<string>) => {
      setInputText(event.detail);
    };

    const handleStartInterviewMode = () => {
      startInterviewMode();
    };

    window.addEventListener('sampleQuestion', handleSampleQuestion as EventListener);
    window.addEventListener('startInterviewMode', handleStartInterviewMode);

    return () => {
      window.removeEventListener('sampleQuestion', handleSampleQuestion as EventListener);
      window.removeEventListener('startInterviewMode', handleStartInterviewMode);
    };
  }, []);

  function handleVoiceInput(transcript: string) {
    setInputText(transcript);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const generateCoachResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Interview-specific responses
    if (message.includes('tell me about yourself') || message.includes('introduce yourself')) {
      return "Great question! For 'Tell me about yourself', structure your answer with: 1) Present - your current role and key responsibilities, 2) Past - relevant experience that led you here, 3) Future - what you're looking to achieve. Keep it to 1-2 minutes and focus on professional highlights.";
    }

    if (message.includes('strength') || message.includes('weakness')) {
      return "For strengths and weaknesses: Choose real examples. For strengths, pick 2-3 that are relevant to the job. For weaknesses, choose something you've improved on (like 'I used to struggle with public speaking, but I've been taking courses and now lead team presentations'). Never say you're a perfectionist!";
    }

    if (message.includes('why do you want') || message.includes('why this company')) {
      return "Research the company thoroughly! Mention: 1) Their mission/values alignment with yours, 2) Specific projects/products that excite you, 3) Growth opportunities, 4) Company culture. Show you've done your homework - name specific things about their work.";
    }

    if (message.includes('behavioral') || message.includes('star method')) {
      return "Use the STAR method for behavioral questions: Situation - set the context, Task - your responsibility, Action - what you did, Result - the outcome with metrics. Always quantify your impact when possible!";
    }

    if (message.includes('salary') || message.includes('compensation')) {
      return "Never bring up salary first! Let them ask. Research market rates for your role/level/location. Consider total compensation (base, bonus, benefits). Practice saying 'I'm flexible' or give a range based on research.";
    }

    if (message.includes('questions') && message.includes('ask')) {
      return "Always prepare 3-5 thoughtful questions: 1) About the role/team dynamics, 2) Company challenges/goals, 3) Next steps in the process, 4) Team/company culture, 5) Growth opportunities. Never ask about salary/benefits in first interview.";
    }

    // General responses
    const generalResponses = [
      "That's an excellent question to practice! Let me give you some tips...",
      "This is a common interview question. Here's how to approach it...",
      "Great choice! This shows you're thinking strategically about your career...",
      "I love that you're preparing for this. Let me break it down for you...",
      "Smart question! Here's what interviewers are really looking for...",
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    // Simulate coach response delay
    setTimeout(() => {
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateCoachResponse(inputText),
        sender: 'coach',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachMessage]);
      setIsThinking(false);

      // Auto-speak the coach's response
      speakText(coachMessage.text);
    }, 1500); // Slightly longer delay to show thinking
  };

  const handleSpeakMessage = (text: string) => {
    setIsSpeaking(true);
    speakText(text, () => setIsSpeaking(false));
  };

  const startInterviewMode = () => {
    setIsInterviewMode(true);
  };

  const exitInterviewMode = () => {
    setIsInterviewMode(false);
  };

  // If in interview mode, render the interviewer component
  if (isInterviewMode) {
    return <InterviewerMode onExitInterview={exitInterviewMode} />;
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              🎯 AI Interview Coach
            </h1>
            <p className="text-white/70 text-sm">Master your next interview with AI-powered guidance</p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-white/60 text-sm">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden max-w-4xl mx-auto w-full">
        <MessageList messages={messages} onSpeakMessage={handleSpeakMessage} />
      </div>

      {/* Input Area */}
      <div className="bg-black/20 backdrop-blur-md border-t border-white/10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-end">
            {/* Microphone Button */}
            <button
              onClick={toggleListening}
              className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 transform ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-lg shadow-red-500/50'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              title={isListening ? 'Stop listening' : 'Start listening'}
            >
              <span className="text-lg">{isListening ? '⏹️' : '🎤'}</span>
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question or speak..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all"
            />

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="flex-shrink-0 p-3 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              title="Send message"
            >
              <span className="text-lg">➤</span>
            </button>
          </div>

          {/* Status Indicators */}
          <div className="mt-3 flex gap-4 text-xs text-white/60">
            {isListening && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Listening...
              </div>
            )}
            {isThinking && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Coach is thinking...
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Speaking...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
