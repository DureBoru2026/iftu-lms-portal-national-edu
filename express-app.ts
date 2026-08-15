import express from "express";
import path from "path";
import { generateExamsForGradesServer, askTutorServer, generateExamQuestionsServer } from "./gemini-server";

const app = express();
app.use(express.json());

// API: Generate Questions via Gemini
app.post("/api/generate-questions", async (req, res) => {
  const { subject, topic, difficulty, questionTypes, count } = req.body;
  try {
    const data = await generateExamQuestionsServer(subject, topic, difficulty, questionTypes, count);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Ask Tutor via Gemini
app.post("/api/ask-tutor", async (req, res) => {
  const { question, language, context, attachment } = req.body;
  try {
    const data = await askTutorServer(question, language, context, attachment);
    res.json({ answer: data });
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Generate Exam via Gemini
app.post("/api/generate-exam", async (req, res) => {
  const { grade, subject } = req.body;
  try {
    const data = await generateExamsForGradesServer(grade, subject);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Validate Exam
app.post("/api/validate-exam", (req, res) => {
  const exam = req.body;
  const errors: string[] = [];

  if (!exam.title || exam.title.trim().length < 5) {
    errors.push("Exam title must be at least 5 characters long.");
  }

  if (!exam.subject || exam.subject.trim().length === 0) {
    errors.push("Subject is required.");
  }

  if (!exam.durationMinutes || exam.durationMinutes < 10) {
    errors.push("Exam duration must be at least 10 minutes.");
  }

  if (!exam.questions || exam.questions.length === 0) {
    errors.push("Exam must contain at least one question.");
  } else {
    exam.questions.forEach((q: any, index: number) => {
      if (!q.text || q.text.trim().length < 10) {
        errors.push(`Question ${index + 1} text is too short (min 10 chars).`);
      }
      if (!q.category || q.category.trim().length === 0) {
        errors.push(`Question ${index + 1} must have a category.`);
      }
      if (!q.points || q.points <= 0) {
        errors.push(`Question ${index + 1} must have positive points.`);
      }
      if (q.type === 'multiple-choice') {
        if (!q.options || q.options.length < 2) {
          errors.push(`Question ${index + 1} must have at least 2 options.`);
        } else if (q.options.some((opt: string) => !opt || opt.trim().length === 0)) {
          errors.push(`Question ${index + 1} has empty options.`);
        }
      }
    });
  }

  if (!exam.categories || exam.categories.length === 0) {
    errors.push("Exam must have at least one category derived from questions.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ valid: false, errors });
  }

  res.json({ valid: true });
});

export default app;
