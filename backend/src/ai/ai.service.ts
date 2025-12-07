import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async gradeSubmission(
    submissionText: string,
    assignmentDescription: string,
    maxPoints: number,
  ): Promise<{ score: number; feedback: string[] }> {
    const systemPrompt = `You are an expert high school teacher assistant. You are fair, constructive, and encouraging.
Your task is to grade the following student submission based on the assignment description provided.
Assign a score out of ${maxPoints}.
Provide 3 bullet points of specific feedback (1 strength, 2 areas for improvement).
Keep the tone supportive but academic.
Output JSON format: { "score": number, "feedback": string[] }`;

    const userPrompt = `Assignment Description:
${assignmentDescription}

Student Submission:
${submissionText}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        score: Math.min(result.score, maxPoints),
        feedback: result.feedback || [],
      };
    } catch (error) {
      console.error('AI Grading Error:', error);
      throw new Error('Failed to grade submission');
    }
  }

  async studyBuddyChat(
    message: string,
    courseName: string,
    courseContext?: string,
  ): Promise<string> {
    const systemPrompt = `You are 'Nexus', a helpful study companion for a student.
Context: The student is asking about ${courseName}.
${courseContext ? `Relevant Course Material: ${courseContext}` : ''}

Rules:
- Do NOT write the essay for them.
- Do NOT give direct answers to quizzes.
- Guide them using Socratic questioning.
- If they seem stressed (detected via sentiment analysis of their text), gently suggest taking a break.
- Be encouraging and supportive.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to get response from study buddy');
    }
  }

  async generateSummary(content: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes educational content concisely.',
          },
          {
            role: 'user',
            content: `Please provide a concise summary of the following content:\n\n${content}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Summary Error:', error);
      throw new Error('Failed to generate summary');
    }
  }
}
