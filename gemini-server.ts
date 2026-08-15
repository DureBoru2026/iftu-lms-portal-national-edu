
import { GoogleGenAI, Type } from "@google/genai";
import * as mammoth from "mammoth";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const LANGUAGE_NAMES = {
  am: "Amharic (አማርኛ)",
  om: "Afan Oromo (Oromoo)",
  en: "English"
};

export const generateExamsForGradesServer = async (grade: string, subject: string) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: `Search for Ethiopian Grade ${grade} ${subject} textbook Unit 1 content. 
    1. Generate a high-quality exam with 10 multiple-choice questions based ONLY on Unit 1.
    2. Extract 5-10 key terms or concepts from Unit 1 with their "individual meaning" (definitions).
    Return both in the specified JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          courseCode: { type: Type.STRING },
          keyConcepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                meaning: { type: Type.STRING }
              },
              required: ["term", "meaning"]
            }
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                type: { type: Type.STRING, description: "Must be 'multiple-choice'" },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                points: { type: Type.INTEGER },
                category: { type: Type.STRING }
              },
              required: ["text", "type", "options", "correctAnswer", "points", "category"]
            }
          }
        },
        required: ["title", "courseCode", "questions", "keyConcepts"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const askTutorServer = async (
  question: string, 
  language: string = 'en', 
  context?: string,
  attachment?: { data: string, mimeType: string }
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const parts: any[] = [
    { text: context ? `Document/Context:\n${context}\n\nQuestion: ${question}` : `Context: General Education\nQuestion: ${question}` }
  ];

  if (attachment) {
    if (attachment.mimeType === 'application/msword') {
      throw new Error("Unsupported MIME type: application/msword. Please convert .doc files to .docx or .pdf.");
    }
    if (attachment.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const buffer = Buffer.from(attachment.data, 'base64');
      const result = await mammoth.extractRawText({ buffer });
      parts.push({ text: `Attached Document Content:\n${result.value}` });
    } else {
      parts.push({
        inlineData: {
          data: attachment.data,
          mimeType: attachment.mimeType
        }
      });
    }
  }

  const response = await ai.models.generateContent({
    model: attachment ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash',
    contents: [{ parts }],
    config: {
      systemInstruction: `You are IFTU AI, the official digital tutor for the Ethiopian National Curriculum (EAES Standards). 
      Greetings like 'Akam', 'Selam', 'Hello' should be met with professional greetings and an offer to help with studies.
      The student is currently using ${LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES] || 'English'}.`,
      temperature: 0.7,
    }
  });

  return response.text;
};

export const generateExamQuestionsServer = async (
  subject: string, 
  topic: string, 
  difficulty: string, 
  questionTypes: string[],
  count: number = 5
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: `Generate ${count} high-quality educational questions for Subject: ${subject}, Topic: ${topic}. 
    Difficulty Level: ${difficulty}. 
    Question Formats to include: ${questionTypes.join(', ')}.
    
    Strict Rules for Question Types:
    1. 'multiple-choice': Provide exactly 4 distinct options. 'correctAnswer' MUST be the index (0, 1, 2, or 3) of the correct option.
    2. 'true-false': Provide exactly 2 options: ["True", "False"]. 'correctAnswer' MUST be 0 for True or 1 for False.
    3. 'fill-in-the-blank': 'options' MUST be an empty array []. 'correctAnswer' MUST be the exact string of the correct word or phrase.
    4. 'short-answer': 'options' MUST be an empty array []. 'correctAnswer' MUST be a concise model answer string.
    
    Each question must have:
    - 'text': The question prompt.
    - 'type': Exactly one of the requested formats.
    - 'points': An appropriate integer value (e.g., 2, 5, or 10).
    - 'category': A specific sub-topic or skill area (e.g., "Mechanics", "Grammar", "Logic").`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            type: { type: Type.STRING, description: "One of: multiple-choice, true-false, fill-in-the-blank, short-answer" },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING, description: "Index (0-3) as string for MC/TF, or the answer text for others" },
            points: { type: Type.INTEGER },
            category: { type: Type.STRING }
          },
          required: ["text", "type", "options", "correctAnswer", "points", "category"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

// Add other server-side functions here if needed, or make a generic one.
