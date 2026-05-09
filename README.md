# AI Powered Interview Coach

A modern, interactive chatbot application designed to help Power Platform and Copilot Studio developers prepare for technical interviews with both voice and text support.

## Features

✨ **Core Features**
- 🎤 **Voice Input**: Speak your questions using Web Speech API
- 🔊 **Voice Output**: Listen to coach responses with Text-to-Speech
- 💬 **Text Chat**: Type your questions directly
- 📝 **Message History**: View conversation history with timestamps
- 🎨 **Modern UI**: Beautiful gradient interface with smooth animations
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🤖 **Smart Responses**: Interview-specific coaching with tailored advice
- 💡 **Sample Questions**: Quick-start buttons for common interview topics
- ⚡ **Real-time Feedback**: Visual indicators for listening, thinking, and speaking states

🎯 **Interview Mode Features**
- 📋 **Structured Interviews**: 8-question sessions for Power Platform + Copilot Studio developers
- 🎪 **Interviewer Simulation**: AI acts as interviewer asking professional questions
- 💡 **Example Answers**: Detailed examples provided after each response
- 📊 **Performance Feedback**: Comprehensive feedback report with scores and recommendations
- 📈 **Progress Tracking**: Visual progress bar and question counter
- 🏷️ **Question Categories**: Technical, behavioral, and situational questions
- 📊 **Skill Assessment**: Separate scoring for technical, communication, and problem-solving skills

## Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Voice APIs**: Web Speech API (Speech Recognition & Text-to-Speech)
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd "AI Powered Coach"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will automatically open at `http://localhost:5173`

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How to Use

### Free Chat Mode
1. **Ask Questions**: Type or speak any interview-related question
2. **Get Advice**: Receive tailored coaching and tips
3. **Voice Support**: Use microphone for voice input, speaker for voice output

### Structured Interview Mode
1. **Start Interview**: Click "🎯 Structured Interview" on the welcome screen
2. **Answer Questions**: Respond to 8 professional questions covering:
   - Power Platform fundamentals (Apps, Automate, BI)
   - Copilot Studio development
   - Technical problem-solving
   - Behavioral interview scenarios
3. **Learn from Examples**: After each answer, see example responses with key points
4. **Receive Feedback**: Get comprehensive feedback with scores and recommendations

### Voice Features
- 🎤 **Click microphone** to speak your questions/answers
- 🔊 **Click speaker icons** to hear responses
- 📱 **Works on mobile** with full voice support

## Interview Content

The structured interview covers essential topics for Power Platform + Copilot Studio developers:

### Technical Questions
- Power Apps development and optimization
- Power Automate workflows and automation
- Dataverse data management and security
- Copilot Studio chatbot development
- Integration between Power Platform tools

### Behavioral Questions
- Learning new technologies quickly
- Solving complex technical problems
- Team collaboration and communication
- Handling challenging project requirements

### Situational Questions
- Performance optimization scenarios
- System integration challenges
- Multi-system workflow design
- Production issue troubleshooting

### Feedback Categories
- **Technical Proficiency**: Knowledge of Power Platform tools
- **Communication Skills**: Clarity and structure of responses
- **Problem Solving**: Analytical thinking and solution approach

## Browser Compatibility

- Chrome/Chromium (Full support)
- Firefox (Full support)
- Safari (Partial support - speech recognition may have limitations)
- Edge (Full support)

⚠️ **Note**: Speech recognition requires HTTPS in production environments.

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx         # Main chat component with mode switching
│   ├── InterviewerMode.tsx       # Structured interview component
│   ├── MessageList.tsx           # Message display with sample questions
│   └── VoiceControls.tsx         # Voice functionality hook
├── data/
│   └── interviewQuestions.ts     # Power Platform interview questions database
├── types/
│   ├── index.ts                  # General TypeScript types
│   └── interview.ts              # Interview-specific types
├── App.tsx                       # Main App component
├── main.tsx                      # Entry point
└── index.css                     # Global styles
```

## Future Enhancements

- [ ] Backend integration for AI responses
- [ ] User authentication
- [ ] Save conversation history
- [ ] Different interview categories
- [ ] Performance metrics and feedback
- [ ] Dark/Light theme toggle
- [ ] Multiple language support

## License

MIT

## Support

For issues or suggestions, please create an issue in the repository.
