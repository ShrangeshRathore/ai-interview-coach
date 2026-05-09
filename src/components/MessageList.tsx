import React from 'react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  onSpeakMessage: (text: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onSpeakMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/10 backdrop-blur-md">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-white/60 text-center">
          <div>
            <p className="text-lg font-medium mb-4">👋 Welcome to AI Interview Coach</p>
            <p className="text-sm mb-6">Choose how you'd like to practice:</p>
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-6">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('startInterviewMode'))}
                className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-left">
                  <div className="text-lg mb-1">🎯 Structured Interview</div>
                  <div className="text-sm opacity-90">8 questions with feedback & examples</div>
                </div>
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('sampleQuestion', { detail: 'How do I answer "Tell me about yourself"?' }))}
                className="p-4 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <div className="text-left">
                  <div className="text-lg mb-1">💬 Free Chat</div>
                  <div className="text-sm opacity-90">Ask any interview question</div>
                </div>
              </button>
            </div>
            <div className="text-xs space-y-2 text-white/40 max-w-md mx-auto">
              <p className="font-medium text-white/60 mb-2">💡 Popular Topics:</p>
              <div className="grid grid-cols-1 gap-2 text-left">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('sampleQuestion', { detail: 'How do I prepare for Power Platform interviews?' }))}
                  className="text-left p-2 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs"
                >
                  "How do I prepare for Power Platform interviews?"
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('sampleQuestion', { detail: 'What are common Copilot Studio questions?' }))}
                  className="text-left p-2 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs"
                >
                  "What are common Copilot Studio questions?"
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('sampleQuestion', { detail: 'How should I handle behavioral interview questions?' }))}
                  className="text-left p-2 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs"
                >
                  "How should I handle behavioral interview questions?"
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white/20 text-white rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.sender === 'coach' && (
                  <button
                    onClick={() => onSpeakMessage(message.text)}
                    className="ml-3 text-xs hover:opacity-80 transition-opacity"
                    title="Speak this message"
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

import { useRef } from 'react';

export default MessageList;
