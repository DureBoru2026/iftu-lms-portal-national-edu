
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Question, News, Exam, Grade, Difficulty, QuestionType } from "../types";
import * as mammoth from "mammoth";

const LANGUAGE_NAMES = {
  am: "Amharic (አማርኛ)",
  om: "Afan Oromo (Oromoo)",
  en: "English"
};

export const askTutor = async (
  question: string, 
  language: Language = 'en', 
  context?: string,
  attachment?: { data: string, mimeType: string }
) => {
  try {
    const response = await fetch("/api/ask-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, language, context, attachment }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.answer;
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
      return `[SYSTEM NOTE: National Intelligence Quota Reached] 
      
      I am currently at maximum capacity for real-time processing. However, as your official tutor, I am still here to help! 
      
      Please try again in a few minutes, or ask a simpler question. In the meantime, you can review your existing course materials and previous lesson summaries.`;
    }

    console.warn("Gemini Live Service Note:", errorMsg);
    
    // Provide an intelligent, contextual fallback answer when API key or connection is pending
    const qLower = question.toLowerCase();
    
    if (language === 'om' || qLower.includes('akam') || qLower.includes('nagaa') || qLower.includes('orom')) {
      return `Akam! Nageenyi Waaqayyoo isiniif haa ta'u. Ani Barsiisaa Barsiisotaa (IFTU AI Tutor) dha. 

Qormaata Biyyooleessaa (EAES), Saayinsii, Hissaba (Maths), Piziksiidhaaf fi barnoota TVET irratti gaaffii qabdu cufa na gaafachuu dandeessu. 

Qabxiilee gurguddoo qorannoo:
1. Qormaata qorachuu fi irra deebi'uu.
2. Qabxii qormaataa ol kaasuu.
3. Barnoota Teknikaa fi Ogummaa (TVET) guddisuu.

Gaaffii biraa yoo qabaattan amma naaf barreessaa!`;
    }

    if (language === 'am' || qLower.includes('ሰላም') || qLower.includes('አለም')) {
      return `ሰላም! እኔ የIFTU LMS ዲጂታል መምህር (AI Tutor) ነኝ። 

በብሔራዊ ፈተናዎች (EAES)፣ በሳይንስ፣ በሂሳብ እና በቴክኒክና ሙያ (TVET) ትምህርቶች ላይ ለሚኖሩዎት ማንኛውም ጥያቄዎች እርስዎን ለመርዳት ዝግጁ ነኝ። 

ማንኛውንም ትምህርታዊ ጥያቄ አሁኑኑ መጠየቅ ይችላሉ!`;
    }

    return `Hello! Welcome to IFTU National AI Learning Assistant. 

I am your official Ethiopian Curriculum (EAES Standard) digital tutor. I can assist you with:
• National Exam Practice & Solutions (Grades 9-12 STEM & Social Streams)
• Technical & Vocational Education & Training (TVET) concepts
• Detailed explanations of textbook units and lesson summaries

Feel free to ask any specific academic question or request a study summary for your course!`;
  }
};

/**
 * Parses questions directly from a document (PDF or DOCX) using Gemini's multi-modal capabilities.
 */
export const parseExamFromDocument = async (base64Data: string, mimeType: string): Promise<Partial<Question>[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    let parts: any[] = [];

    if (mimeType === 'application/msword') {
      throw new Error("Unsupported MIME type: application/msword. Please convert .doc files to .docx or .pdf.");
    }

    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const result = await mammoth.extractRawText({ arrayBuffer: bytes.buffer });
      parts = [
        { text: result.value },
        { text: "Extract all multiple-choice questions from this document text. Return them in the specified JSON format. Ensure you extract the options, the correct answer index (0-3), points per question, and a category for each question." }
      ];
    } else {
      parts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: "Extract all multiple-choice questions from this document. Return them in the specified JSON format. Ensure you extract the options, the correct answer index (0-3), points per question, and a category for each question."
        }
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              points: { type: Type.INTEGER },
              category: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "points", "category"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Document Parsing Error:", error);
    return [];
  }
};

export const getRegionalIntelligence = async (region: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a detailed educational status report for the region of ${region}, Ethiopia. Include mapping of 3 major TVET hubs and secondary school density metrics.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
      }
    });
    
    const insights = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text,
      mapData: insights
    };
  } catch (error) {
    console.error("Intelligence Error:", error);
    return null;
  }
};

export const fetchLatestEducationNews = async (): Promise<News[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "What are the latest news updates from the Ethiopian Ministry of Education (MoE) regarding national exams and TVET for 2025? Provide at least 3 news items.",
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              date: { type: Type.STRING },
              tag: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              content: { type: Type.STRING },
              image: { type: Type.STRING }
            },
            required: ["id", "date", "tag", "title", "summary", "content", "image"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) { 
    console.error("News Fetch Error:", error);
    return []; 
  }
};

export const getLessonDeepDive = async (text: string, type: 'simpler' | 'advanced', language: Language = 'en') => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  const prompt = type === 'simpler' 
    ? `Explain the following lesson content in very simple terms, using analogies that a child could understand. Focus on the core concept and avoid technical jargon. Content: ${text}` 
    : `Provide an advanced technical deep dive into the following lesson content. Include historical context, advanced theoretical implications, and real-world industrial applications. Content: ${text}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: `Explain in ${LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES] || 'English'}.` }
    });
    return response.text;
  } catch (error) { return "Deep dive failed."; }
};

export const parseExamDocument = async (text: string): Promise<Partial<Question>[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Extract multiple-choice questions from: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              points: { type: Type.INTEGER },
              category: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "points", "category"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) { return []; }
};

export const generateExamQuestions = async (
  subject: string, 
  topic: string, 
  difficulty: string, 
  questionTypes: string[],
  count: number = 5
): Promise<Partial<Question>[]> => {
  try {
    const response = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, topic, difficulty, questionTypes, count }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const parsed = await response.json();
    return parsed.map((q: any) => {
      // Normalize correctAnswer based on type
      let normalizedAnswer: string | number = q.correctAnswer;
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        normalizedAnswer = parseInt(q.correctAnswer);
        if (isNaN(normalizedAnswer)) normalizedAnswer = 0; // Fallback
      }
      
      return {
        ...q,
        correctAnswer: normalizedAnswer
      };
    });
  } catch (error) { 
    console.error("Generation Error:", error);
    return []; 
  }
};

export const generateQuizFromLessonContent = async (
  content: string,
  difficulty: Difficulty = 'Medium',
  questionTypes: QuestionType[] = ['multiple-choice'],
  count: number = 5
): Promise<Partial<Question>[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Generate ${count} high-quality educational questions based on the following lesson content:
      
      Content: ${content}
      
      Difficulty Level: ${difficulty}
      Question Types to include: ${questionTypes.join(', ')}
      
      Strict Rules for Question Types:
      1. 'multiple-choice': Provide exactly 4 distinct options. 'correctAnswer' MUST be the index (0, 1, 2, or 3) of the correct option.
      2. 'true-false': Provide exactly 2 options: ["True", "False"]. 'correctAnswer' MUST be 0 for True or 1 for False.
      3. 'fill-in-the-blank': 'options' MUST be an empty array []. 'correctAnswer' MUST be the exact string of the correct word or phrase.
      4. 'short-answer': 'options' MUST be an empty array []. 'correctAnswer' MUST be a concise model answer string.
      
      Each question must have:
      - 'text': The question prompt.
      - 'type': Exactly one of the requested formats.
      - 'points': An appropriate integer value based on complexity (e.g., 2 for easy, 5 for medium, 10 for hard).
      - 'category': A specific sub-topic or concept covered in the content.`,
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
              correctAnswer: { type: Type.STRING, description: "Index (0-3) for MC/TF, or text answer for FITB/SA" },
              points: { type: Type.INTEGER },
              category: { type: Type.STRING }
            },
            required: ["text", "type", "options", "correctAnswer", "points", "category"]
          }
        }
      }
    });
    
    const parsed = JSON.parse(response.text || "[]");
    return parsed.map((q: any) => {
      let normalizedAnswer: string | number = q.correctAnswer;
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        normalizedAnswer = parseInt(q.correctAnswer);
        if (isNaN(normalizedAnswer)) normalizedAnswer = 0;
      }
      return {
        ...q,
        correctAnswer: normalizedAnswer
      };
    });
  } catch (error) { 
    console.error("Lesson Quiz Generation Error:", error);
    return []; 
  }
};

export const generateLessonCheckpoints = async (
  content: string,
  language: Language = 'en'
): Promise<{ question: Partial<Question>, context: string }[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Analyze the following lesson content and generate 3 "Checkpoints". 
      A Checkpoint is a question that verifies understanding of a specific paragraph or concept.
      
      Content: ${content}
      
      For each Checkpoint:
      1. Provide a 'context' snippet: A very short quote or summary of the paragraph this question is testing (max 15 words).
      2. Provide a 'question' object with:
         - 'text': The question prompt.
         - 'type': 'multiple-choice' or 'fill-in-the-blank'.
         - 'options': Exactly 4 for 'multiple-choice', empty [] for 'fill-in-the-blank'.
         - 'correctAnswer': Index (0-3) for MC, or exact string for FITB.
         - 'points': 5.
         - 'category': "Checkpoint".
      
      Ensure questions are strictly based on the text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              context: { type: Type.STRING },
              question: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  type: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  points: { type: Type.INTEGER },
                  category: { type: Type.STRING }
                },
                required: ["text", "type", "options", "correctAnswer", "points", "category"]
              }
            },
            required: ["context", "question"]
          }
        },
        systemInstruction: `Explain in ${LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES] || 'English'}.`
      }
    });
    
    const parsed = JSON.parse(response.text || "[]");
    return parsed.map((item: any) => ({
      ...item,
      question: {
        ...item.question,
        correctAnswer: item.question.type === 'multiple-choice' ? parseInt(item.question.correctAnswer) || 0 : item.question.correctAnswer
      }
    }));
  } catch (error) { 
    console.error("Checkpoint Generation Error:", error);
    return []; 
  }
};

export const findNearbyColleges = async (lat: number, lng: number, type: 'TVET' | 'High School' = 'TVET') => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `List 5 prominent ${type} institutions near lat: ${lat}, lng: ${lng}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      }
    });
    return {
      text: response.text,
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.maps?.title || "Educational Institution",
        uri: chunk.maps?.uri || "#",
        snippet: chunk.maps?.placeAnswerSources?.[0]?.reviewSnippets?.[0] || ""
      })) || []
    };
  } catch (error) { return null; }
};

export const generateExamsForGrades = async (grade: string, subject: string): Promise<Partial<Exam>> => {
  try {
    const response = await fetch("/api/generate-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade, subject }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const parsed = await response.json();
    return {
      ...parsed,
      grade: grade as Grade,
      subject: subject,
      status: 'published',
      totalPoints: parsed.questions?.reduce((acc: number, q: any) => acc + q.points, 0) || 0,
      durationMinutes: 30,
      academicYear: 2025,
      semester: 1,
      type: 'National',
      description: `Unit 1 Mastery Exam. Key Concepts: ${parsed.keyConcepts?.map((c: any) => c.term).join(', ')}`,
      keyConcepts: parsed.keyConcepts
    };
  } catch (error: any) {
    console.error(`Exam Generation Error for Grade ${grade} ${subject}:`, error);
    return {};
  }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find a high-quality, professional, and visually stunning Unsplash image URL that matches this prompt: "${prompt}". 
      The image should be suitable for a professional educational platform (IFTU LMS). 
      Return ONLY the direct Unsplash image URL in this exact format: https://images.unsplash.com/photo-[ID]?q=80&w=1000&auto=format&fit=crop. 
      Use your search grounding to find real, existing photo IDs.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    const urlMatch = response.text.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/);
    if (urlMatch) {
      return urlMatch[0] + "?q=80&w=1000&auto=format&fit=crop";
    }
    // Fallback if no URL found
    return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop";
  } catch (error) {
    console.error("Image Generation Error:", error);
    return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop";
  }
};

export const getSovereignInsights = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following educational data and provide 3-5 strategic "Sovereign Insights" for the school administrator. 
      Focus on student performance, course engagement, and resource allocation.
      Data: ${JSON.stringify(data)}
      
      Format the response as a JSON array of objects with 'title', 'insight', and 'impact' (High/Medium/Low).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              insight: { type: Type.STRING },
              impact: { type: Type.STRING }
            },
            required: ["title", "insight", "impact"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Insights Error:", error);
    return [];
  }
};
