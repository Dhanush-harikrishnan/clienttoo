import axios from 'axios';

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const gemini = {
  chat: {
    completions: {
      create: async ({ messages }: { messages: { role: string; content: string }[] }) => {
        try {
          // Format messages for Gemini API
          const promptParts = messages.map(msg => msg.content).join('\n\n');
          
          const response = await axios.post<GeminiResponse>(
            `${API_URL}?key=${API_KEY}`,
            {
              contents: [
                {
                  parts: [
                    {
                      text: promptParts
                    }
                  ]
                }
              ]
            }
          );
          
          // Format response to match OpenAI structure for compatibility
          return {
            choices: [
              {
                message: {
                  content: response.data.candidates[0]?.content.parts[0].text || 'No response generated'
                }
              }
            ]
          };
        } catch (error) {
          console.error('Error calling Gemini API:', error);
          throw error;
        }
      }
    }
  }
}; 