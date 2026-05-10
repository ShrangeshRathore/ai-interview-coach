export const downloadTextAsFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateQuestionAnalysisText = (
  question: string,
  userAnswer: string,
  analysis: string,
  exampleAnswer: string,
  keyPoints: string[]
): string => {
  return `
Interview Question Analysis
==========================

Question:
${question}

Your Answer:
${userAnswer}

Analysis:
${analysis}

Example Answer:
${exampleAnswer}

Key Points to Cover:
${keyPoints.map(point => `- ${point}`).join('\n')}

Generated on: ${new Date().toLocaleString()}
`;
};

export const generateSessionSummaryText = (session: any): string => {
  const { questions, answers, feedback } = session;

  let content = `
Interview Session Summary
========================

Candidate: ${session.candidateName}
Role: ${session.role}
Date: ${session.startTime.toLocaleString()}
Duration: ${session.endTime ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000) + ' minutes' : 'N/A'}

Overall Score: ${feedback.overallScore}%
Technical Proficiency: ${feedback.technicalProficiency}%
Communication Skills: ${feedback.communicationSkills}%
Problem Solving: ${feedback.problemSolving}%

Strengths:
${feedback.strengths.map((s: string) => `- ${s}`).join('\n')}

Areas for Improvement:
${feedback.areasForImprovement.map((a: string) => `- ${a}`).join('\n')}

Recommendations:
${feedback.recommendations.map((r: string) => `- ${r}`).join('\n')}

Detailed Question Analysis:
==========================

`;

  questions.forEach((q: any, index: number) => {
    const answer = answers.find((a: any) => a.questionId === q.id);
    content += `
Question ${index + 1}: ${q.question}
Category: ${q.category} | Difficulty: ${q.difficulty}

Your Answer:
${answer ? answer.answer : 'No answer provided'}

Example Answer:
${q.expectedAnswer}

Key Points:
${q.keyPoints.map((p: string) => `- ${p}`).join('\n')}

---
`;
  });

  content += `\nGenerated on: ${new Date().toLocaleString()}`;

  return content;
};

// Fetch web resources for enhanced responses
export const fetchWebResource = async (query: string): Promise<string> => {
  try {
    // Using DuckDuckGo Instant Answer API (free, no API key needed)
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' interview tips')}&format=json&no_html=1&skip_disambig=1`);
    const data = await response.json();

    if (data.AbstractText) {
      return `Based on web resources: ${data.AbstractText}`;
    } else if (data.Answer) {
      return `Quick tip: ${data.Answer}`;
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error fetching web resource:', error);
    return '';
  }
};