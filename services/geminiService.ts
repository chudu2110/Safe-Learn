import { GoogleGenAI, Type } from "@google/genai";
import { Scenario } from '../types';

// This function calls the Gemini API for content moderation.
export const moderateQuestion = async (question: string): Promise<{ isAppropriate: boolean; reason: string }> => {
  console.log(`Moderating question: "${question}"`);

  // Basic client-side filter for demonstration
  const inappropriateKeywords = ['tệ', 'xấu', 'ghét'];
  if (inappropriateKeywords.some(keyword => question.toLowerCase().includes(keyword))) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
      return {
          isAppropriate: false,
          reason: 'Câu hỏi chứa ngôn từ không phù hợp. Vui lòng sử dụng ngôn ngữ tôn trọng.'
      };
  }

  try {
    const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_KEY) || process.env.API_KEY;
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        isAppropriate: true,
        reason: 'Câu hỏi của bạn đã được ghi nhận và sẽ được chuyên gia trả lời sớm.'
      };
    }
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are a content moderator for a Vietnamese sexual health education platform.
Analyze the user's question for appropriateness.
- If appropriate, respond with 'isAppropriate: true' and the exact Vietnamese reason: "Câu hỏi của bạn đã được ghi nhận và sẽ được chuyên gia trả lời sớm.".
- If inappropriate (hate speech, bullying, disrespect), respond with 'isAppropriate: false' and a polite, brief Vietnamese reason.
Respond ONLY with the JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAppropriate: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["isAppropriate", "reason"]
        }
      }
    });

    const jsonResponseText = response.text.trim();
    const parsedResult = JSON.parse(jsonResponseText);
    
    return parsedResult;

  } catch (error) {
    console.error("Error calling Gemini API for moderation:", error);
    return {
      isAppropriate: true,
      reason: 'Câu hỏi của bạn đã được ghi nhận và sẽ được chuyên gia trả lời sớm.'
    };
  }
};

// This function calls the Gemini API to generate an interactive scenario.
export const generateScenario = async (): Promise<Scenario | null> => {
    console.log("Generating a new scenario...");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const systemInstruction = `You are an expert in creating educational content for Vietnamese teenagers about sexual and reproductive health.
Create an interactive, multiple-choice scenario.
The scenario should be relatable, safe, and provide clear, constructive feedback.
The topics can include consent, peer pressure, body changes, healthy relationships, or online safety.
Respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Tạo một tình huống tương tác mới về giáo dục giới tính cho thanh thiếu niên Việt Nam.",
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A short, engaging title in Vietnamese." },
                        situation: { type: Type.STRING, description: "A detailed situation description in Vietnamese." },
                        options: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING, description: "An action/choice in Vietnamese." },
                                    feedback: { type: Type.STRING, description: "Constructive feedback for this choice in Vietnamese." }
                                },
                                required: ["text", "feedback"]
                            }
                        }
                    },
                    required: ["title", "situation", "options"]
                }
            }
        });
        
        const jsonResponseText = response.text.trim();
        const parsedResult: Scenario = JSON.parse(jsonResponseText);
        
        // Basic validation
        if (parsedResult.options && parsedResult.options.length > 1) {
             return parsedResult;
        }
        return null;

    } catch (error) {
        console.error("Error calling Gemini API for scenario generation:", error);
        return null;
    }
};
