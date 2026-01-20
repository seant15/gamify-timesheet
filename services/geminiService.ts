
import { GoogleGenAI, Type } from "@google/genai";
import { DayOfWeek, Task } from "../types";
import { PILLARS } from "../constants";

// Correct initialization following Gemini SDK guidelines: use apiKey named parameter and direct process.env reference.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartProductivityAdvice = async (day: DayOfWeek, currentTasks: Task[]) => {
  const pillar = PILLARS[day];
  const taskList = currentTasks.map(t => `- ${t.title} (${t.durationMinutes}m)`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: Today is ${day}, which is a "${pillar.title}" pillar day. 
      Focus: ${pillar.description}.
      Current Tasks for today:
      ${taskList || 'No tasks added yet.'}
      
      Please provide a brief productivity insight (2 sentences) and 3 suggested high-value tasks specifically for this pillar.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusAdvice: { type: Type.STRING },
            suggestedTasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["focusAdvice", "suggestedTasks"]
        }
      }
    });

    // response.text is a getter property, not a method.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini advice failed:", error);
    return {
      focusAdvice: "Focus on your pillar goals today to maximize efficiency.",
      suggestedTasks: ["Review pending items", "Plan next major milestone", "Check communication channels"]
    };
  }
};
