import React, { useState, useEffect, useRef } from 'react';
import { InterviewSession, InterviewQuestion, InterviewFeedback } from '../types/interview';
import { getRandomQuestions } from '../data/interviewQuestions';
import VoiceControls from './VoiceControls';

interface InterviewerModeProps {
  onExitInterview: () => void;
}

const InterviewerMode: React.FC<InterviewerModeProps> = ({ onExitInterview }) => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [awaitingNext, setAwaitingNext] = useState(false);
  const [answerAnalysis, setAnswerAnalysis] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toggleListening, speakText } = VoiceControls({
    onVoiceInput: handleVoiceInput,
    isListening,
    setIsListening,
  });

  function handleVoiceInput(transcript: string) {
    setInputText(transcript);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const startInterview = () => {
    const questions = getRandomQuestions(8); // 8 questions for a comprehensive interview
    const newSession: InterviewSession = {
      id: Date.now().toString(),
      candidateName: 'Candidate',
      role: 'Power Platform + Copilot Studio Developer',
      startTime: new Date(),
      questions,
      answers: [],
      status: 'in-progress'
    };
    setSession(newSession);
    setSessionStarted(true);

    // Start with introduction and ask first question after introduction finishes
    setTimeout(() => {
      setIsSpeaking(true);
      speakText(
        "Welcome to your Power Platform and Copilot Studio developer interview. I'll be asking you 8 questions to assess your skills and experience. After each question, I'll provide an example of how you could answer it. Let's begin!",
        () => {
          setIsSpeaking(false);
          askNextQuestion();
        }
      );
    }, 500);
  };

  const askNextQuestion = () => {
    if (!session || currentQuestionIndex >= session.questions.length) {
      endInterview();
      return;
    }

    const question = session.questions[currentQuestionIndex];
    setShowExample(false);
    setAwaitingNext(false);
    setAnswerAnalysis(null);
    setUserAnswer(null);

    setTimeout(() => {
      setIsSpeaking(true);
      speakText(question.question, () => setIsSpeaking(false));
    }, 1000);
  };

  const analyzeAnswer = (answer: string, question: InterviewQuestion): string => {
    const normalizedAnswer = answer.toLowerCase();
    const coveredPoints = question.keyPoints.filter((point: string) => {
      const keywords = point.toLowerCase().split(/[^a-z0-9]+/).filter((word: string) => word.length > 3);
      return keywords.some((word: string) => normalizedAnswer.includes(word));
    });

    const missingPoints = question.keyPoints.filter((point: string) => !coveredPoints.includes(point));
    const score = Math.round((coveredPoints.length / question.keyPoints.length) * 100);

    let analysis = `I analyzed your answer and found ${coveredPoints.length} of ${question.keyPoints.length} key points. Your response scored ${score}% for coverage.`;
    if (coveredPoints.length) {
      analysis += ` You mentioned ${coveredPoints.slice(0, 3).map((point: string) => point.replace(/ - .*$/, '')).join(', ')}.`;
    }
    if (missingPoints.length) {
      analysis += ` To improve, try including: ${missingPoints.slice(0, 3).map((point: string) => point.replace(/.*- /, '')).join(', ')}.`;
    }

    if (score < 50) {
      analysis = `Your answer is a good start, but it would be stronger with more detail. ${analysis}`;
    }

    return analysis;
  };

  const handleAnswerSubmit = () => {
    if (!session || !inputText.trim()) return;

    const currentQuestion = session.questions[currentQuestionIndex];
    const answer = {
      questionId: currentQuestion.id,
      answer: inputText,
      timestamp: new Date()
    };

    setSession(prev => prev ? {
      ...prev,
      answers: [...prev.answers, answer]
    } : null);

    setUserAnswer(inputText);
    setAnswerAnalysis(analyzeAnswer(inputText, currentQuestion));
    setInputText('');
    setShowExample(true);
    setAwaitingNext(true);

    // Show example answer
    setTimeout(() => {
      setIsSpeaking(true);
      speakText(`Here's an example of how you could answer this question: ${currentQuestion.expectedAnswer}`, () => setIsSpeaking(false));
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (!session) return;

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= session.questions.length) {
      endInterview();
      return;
    }

    setCurrentQuestionIndex(nextIndex);
    setShowExample(false);
    setAwaitingNext(false);
    setInputText('');
    setUserAnswer(null);
    setAnswerAnalysis(null);

    setTimeout(() => {
      askNextQuestion();
    }, 500);
  };

  const endInterview = () => {
    if (!session) return;

    const feedback = generateFeedback(session);
    setSession(prev => prev ? {
      ...prev,
      endTime: new Date(),
      feedback,
      status: 'completed'
    } : null);

    setTimeout(() => {
      setIsSpeaking(true);
      speakText("Thank you for completing the interview. Here's your feedback summary.", () => setIsSpeaking(false));
    }, 1000);
  };

  const generateFeedback = (session: InterviewSession): InterviewFeedback => {
    // Simple scoring based on answer length and keywords (in a real app, this would be more sophisticated)
    const answers = session.answers;
    let totalScore = 0;

    answers.forEach(answer => {
      const length = answer.answer.length;
      if (length > 100) totalScore += 2; // Good detail
      else if (length > 50) totalScore += 1; // Adequate
      // Could add keyword analysis here
    });

    const maxScore = answers.length * 2;
    const overallScore = Math.round((totalScore / maxScore) * 100);

    return {
      overallScore,
      strengths: [
        'Good understanding of Power Platform concepts',
        'Clear communication style',
        'Relevant technical knowledge demonstrated'
      ],
      areasForImprovement: [
        'Could provide more specific examples',
        'Consider quantifying achievements',
        'Practice structuring answers with STAR method'
      ],
      technicalProficiency: Math.round(overallScore * 0.8),
      communicationSkills: Math.round(overallScore * 0.9),
      problemSolving: Math.round(overallScore * 0.7),
      recommendations: [
        'Review Power Platform documentation regularly',
        'Practice with real-world scenarios',
        'Consider obtaining relevant certifications',
        'Join Power Platform community forums'
      ]
    };
  };

  useEffect(() => {
    if (sessionStarted && currentQuestionIndex === 0) {
      setTimeout(() => askNextQuestion(), 3000);
    }
  }, [sessionStarted, currentQuestionIndex]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnswerSubmit();
    }
  };

  if (!sessionStarted) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4 md:p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              🎯 Power Platform Interview Session
            </h1>
            <p className="text-white/70 mb-6">Structured interview for Power Platform + Copilot Studio developers</p>
            <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-white mb-4">Session Overview</h2>
              <div className="text-left text-white/80 space-y-2 mb-6">
                <p>📋 <strong>8 Questions</strong> covering technical and behavioral topics</p>
                <p>🎤 <strong>Voice Support</strong> - Speak or type your answers</p>
                <p>💡 <strong>Example Answers</strong> provided after each response</p>
                <p>📊 <strong>Feedback Report</strong> at the end with scores and recommendations</p>
                <p>⏱️ <strong>Duration</strong> - Approximately 20-30 minutes</p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startInterview}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                >
                  🚀 Start Interview
                </button>
                <button
                  onClick={onExitInterview}
                  className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  ← Back to Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (session?.status === 'completed' && session.feedback) {
    const feedback = session.feedback;
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4 md:p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              📊 Interview Complete!
            </h1>
            <p className="text-white/70 mb-6">Here's your performance feedback</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Overall Score */}
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Overall Score</h2>
              <div className="text-6xl font-bold text-green-400 mb-2">{feedback.overallScore}%</div>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${feedback.overallScore}%` }}
                ></div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Technical Skills</h3>
                <div className="text-3xl font-bold text-blue-400">{feedback.technicalProficiency}%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Communication</h3>
                <div className="text-3xl font-bold text-green-400">{feedback.communicationSkills}%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Problem Solving</h3>
                <div className="text-3xl font-bold text-purple-400">{feedback.problemSolving}%</div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">💪 Strengths</h3>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🎯 Areas for Improvement</h3>
              <ul className="space-y-2">
                {feedback.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-center text-white/90">
                    <span className="text-blue-400 mr-2">📈</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🚀 Recommendations</h3>
              <ul className="space-y-2">
                {feedback.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center text-white/90">
                    <span className="text-purple-400 mr-2">💡</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                🔄 Take Another Interview
              </button>
              <button
                onClick={onExitInterview}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                ← Back to Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session?.questions[currentQuestionIndex];
  const progress = session ? ((currentQuestionIndex + 1) / session.questions.length) * 100 : 0;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              🎯 Power Platform Interview
            </h1>
            <button
              onClick={onExitInterview}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            >
              Exit Interview
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-white/70 text-sm mb-2">
              <span>Question {currentQuestionIndex + 1} of {session?.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Area */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full">
        <div className="p-6 space-y-6">
          {/* Current Question */}
          {currentQuestion && !showExample && (
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Current Question:</h2>
              <p className="text-white/90 text-lg leading-relaxed">{currentQuestion.question}</p>
              <div className="mt-4 flex items-center text-sm text-white/60">
                <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 mr-2">
                  {currentQuestion.category}
                </span>
                <span className="px-2 py-1 bg-green-500/20 rounded text-green-300">
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>
          )}

          {/* Example Answer */}
          {showExample && currentQuestion && (
            <div className="space-y-4">
              {userAnswer && (
                <div className="bg-blue-500/20 rounded-lg p-6 border border-blue-400/30">
                  <h2 className="text-xl font-semibold text-blue-300 mb-4">📤 Your Answer</h2>
                  <p className="text-white/90 text-lg leading-relaxed">{userAnswer}</p>
                </div>
              )}
              {answerAnalysis && (
                <div className="bg-yellow-500/20 rounded-lg p-6 border border-yellow-400/30">
                  <h2 className="text-xl font-semibold text-yellow-300 mb-4">📝 Your Answer Analysis</h2>
                  <p className="text-white/90 text-lg leading-relaxed">{answerAnalysis}</p>
                </div>
              )}
              <div className="bg-green-500/20 rounded-lg p-6 border border-green-400/30">
                <h2 className="text-xl font-semibold text-green-300 mb-4">💡 Example Answer:</h2>
                <p className="text-white/90 text-lg leading-relaxed mb-4">{currentQuestion.expectedAnswer}</p>
                <h3 className="text-lg font-semibold text-green-300 mb-2">Key Points to Cover:</h3>
                <ul className="space-y-1">
                  {currentQuestion.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start text-white/80">
                      <span className="text-green-400 mr-2 mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
                {awaitingNext && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      {currentQuestionIndex + 1 >= session.questions.length ? 'Finish Interview' : 'Next Question'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Answer Input */}
          {currentQuestion && !showExample && (
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Answer:</h3>
              <div className="flex gap-2 items-end">
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

                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer or speak..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all"
                />

                <button
                  onClick={handleAnswerSubmit}
                  disabled={!inputText.trim()}
                  className="flex-shrink-0 p-3 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  title="Submit answer"
                >
                  <span className="text-lg">➤</span>
                </button>
              </div>

              {/* Status Indicators */}
              <div className="mt-4 flex gap-4 text-xs text-white/60">
                {isListening && (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Listening...
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
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewerMode;