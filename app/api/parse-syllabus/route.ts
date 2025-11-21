import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import mammoth from "mammoth";
import pdfParse from "pdf-parse-fork";
import { prisma } from "@/lib/prisma";
import { canUserParseSyllabus, recordUsage } from "@/lib/usage";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
}

function categorizeEvent(title: string): string {
  const lowerTitle = title.toLowerCase();

  // Assignment patterns
  if (lowerTitle.match(/\b(assignment|homework|hw|problem set|ps|essay|paper|project)\b/i)) {
    return "assignment";
  }

  // Quiz patterns (check before exam to prioritize)
  if (lowerTitle.match(/\b(quiz|quizzes)\b/i)) {
    return "quiz";
  }

  // Class patterns - check BEFORE exams to avoid false positives
  // If title explicitly mentions "class", "lecture", "lab", etc., it's a class
  if (lowerTitle.match(/\b(class|lecture|lab|discussion|session|review|preparation|prep|workshop)\b/i)) {
    return "class";
  }

  // Exam patterns - VERY strict matching
  // Only match if it's clearly an exam and NOT a class/review/presentation
  // Must NOT be followed by words like "review", "prep", "preparation"
  if (lowerTitle.match(/\b(midterm|final)\s+(exam|test)\s+(review|prep|preparation)\b/i)) {
    // This is a review session, not an exam - skip to other patterns
  } else if (lowerTitle.match(/\b(midterm|final)\s+(exam|test)\b/i) ||
             lowerTitle.match(/^(exam|test)\s*\d*$/i) ||
             lowerTitle.match(/^(midterm|final exam)$/i)) {
    return "exam";
  }

  // Reading patterns
  if (lowerTitle.match(/\b(reading|chapter|article|book)\b/i)) {
    return "reading";
  }

  return "other";
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractEventsWithClaude(text: string): Promise<CalendarEvent[]> {
  // Increase text limit to capture more content (about 50,000 characters = ~12,500 tokens)
  const truncatedText = text.length > 50000 ? text.substring(0, 50000) + "\n[truncated]" : text;

  const prompt = `You are an expert calendar event extractor. Your ONLY job is to find EVERY SINGLE date-related item in this syllabus and convert it to a calendar event.

CRITICAL INSTRUCTIONS:
1. Extract EVERY event with a date - do not skip anything
2. Look through the ENTIRE syllabus carefully
3. Common items to extract:
   - All assignments (HW, homework, problem sets, papers, essays, projects)
   - All tests (exams, midterms, finals, quizzes)
   - All readings (chapters, articles, book sections)
   - All class sessions (lectures, labs, discussions, office hours)
   - All project milestones and deadlines
   - All presentations
   - Any other dated activities or deadlines

4. If an item has a date range (e.g., "Week 1-2"), create separate events for key dates
5. If you see a schedule or calendar in the syllabus, extract EVERY entry

TITLE FORMATTING RULES (VERY IMPORTANT):
- Regular class sessions: Title must start with "Class -" (e.g., "Class - Aug 25", "Class - Sept 3")
- Exams ONLY: Use "Midterm Exam 1", "Midterm Exam 2", "Final Exam" (only for actual graded exams)
- Quizzes: Start with "Quiz" (e.g., "Quiz 1")
- Assignments: Start with "Assignment:", "Paper:", "Essay:", etc.
- Review sessions: Start with "Class -" (NOT "Exam" - these are NOT exams, they are classes)
- DO NOT use the word "Exam" or "Test" in titles unless it is an actual graded examination

Return ONLY a JSON array with this exact format (DO NOT include description or location):
[{"title":"Assignment 1","start":"YYYY-MM-DDTHH:mm:ss"}]

Date/Time Rules:
- Due dates/assignments: use 23:59:00 if no specific time given
- Classes/exams: use 09:00:00 if no specific time given (use actual time if provided)
- If year not specified, use 2025
- If month is before current month (November), assume next year (2026)
- Format: ISO 8601 (YYYY-MM-DDTHH:mm:ss)

IMPORTANT: Extract ALL events. If the syllabus has 50 events, return all 50. Do not summarize or skip any.

Syllabus Text:
${truncatedText}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929", // More capable model for better extraction
    max_tokens: 8192, // Increased to handle more events
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const responseText = message.content[0].type === "text" ? message.content[0].text : "";

  // Clean up the response to ensure it's valid JSON
  let jsonText = responseText.trim();

  // Remove any explanatory text before the JSON array
  const arrayStart = jsonText.indexOf("[");
  if (arrayStart > 0) {
    jsonText = jsonText.substring(arrayStart);
  }

  // Remove any text after the JSON array
  const arrayEnd = jsonText.lastIndexOf("]");
  if (arrayEnd > 0 && arrayEnd < jsonText.length - 1) {
    jsonText = jsonText.substring(0, arrayEnd + 1);
  }

  // Remove markdown code blocks if present
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\s*/g, "");
    jsonText = jsonText.replace(/\s*```\s*$/g, "");

    // Re-find array boundaries after removing code blocks
    const arrayStart = jsonText.indexOf("[");
    const arrayEnd = jsonText.lastIndexOf("]");
    if (arrayStart >= 0 && arrayEnd > arrayStart) {
      jsonText = jsonText.substring(arrayStart, arrayEnd + 1);
    }
  }

  // Handle incomplete JSON if the response was truncated
  if (!jsonText.endsWith("]")) {
    console.warn("Response appears truncated, attempting to fix JSON array...");
    const lastCompleteObjectIndex = jsonText.lastIndexOf("}");
    if (lastCompleteObjectIndex !== -1) {
      jsonText = jsonText.substring(0, lastCompleteObjectIndex + 1);
      jsonText += "\n]";
    }
  }

  try {
    const events = JSON.parse(jsonText);
    console.log(`Successfully parsed ${events.length} events from JSON`);
    return events;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.error("Original response (first 500 chars):", responseText.substring(0, 500));
    console.error("Original response (last 500 chars):", responseText.substring(responseText.length - 500));
    console.error("Cleaned JSON (first 500 chars):", jsonText.substring(0, 500));
    console.error("Cleaned JSON (last 500 chars):", jsonText.substring(jsonText.length - 500));
    throw new Error("Failed to parse events from syllabus. The response may have been too long or malformed.");
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Parse Syllabus Request Started ===");

    // Check authentication
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to use this service." },
        { status: 401 }
      );
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // If user doesn't exist, create them (handles first-time users before webhook runs)
    if (!user) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

      if (!email) {
        return NextResponse.json(
          { error: "Could not get email from Clerk. Please try signing in again." },
          { status: 400 }
        );
      }

      // Check if user exists with this email (but different clerkId)
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        // Update the clerkId for existing user
        user = await prisma.user.update({
          where: { id: existingUserByEmail.id },
          data: { clerkId: userId },
        });
        console.log(`Updated existing user's clerkId: ${userId}`);
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email,
            subscriptionTier: "free",
          },
        });
        console.log(`Created new user in database: ${userId}`);
      }
    }

    // Check usage limits
    const usageCheck = await canUserParseSyllabus(user.id, user.subscriptionTier);
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: usageCheck.reason,
          currentUsage: usageCheck.currentUsage,
          limit: usageCheck.limit,
          needsUpgrade: true,
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    let text = "";

    // Check if text was directly provided
    const directText = formData.get("text");
    if (directText) {
      console.log("Using direct text input");
      text = directText.toString();
    } else {
      // Process uploaded file
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json(
          { error: "No file or text provided" },
          { status: 400 }
        );
      }

      console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileType = file.name.toLowerCase();

      if (fileType.endsWith(".pdf")) {
        console.log("Extracting text from PDF...");
        text = await extractTextFromPDF(buffer);
        console.log(`Extracted ${text.length} characters from PDF`);
      } else if (fileType.endsWith(".docx") || fileType.endsWith(".doc")) {
        console.log("Extracting text from DOCX...");
        text = await extractTextFromDOCX(buffer);
        console.log(`Extracted ${text.length} characters from DOCX`);
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Please upload PDF or DOCX" },
          { status: 400 }
        );
      }
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text could be extracted from the file" },
        { status: 400 }
      );
    }

    // Extract events using Claude
    console.log("Sending to Claude for event extraction...");
    const events = await extractEventsWithClaude(text);
    console.log(`Successfully extracted ${events.length} events`);

    // Save syllabus to database
    const fileName = formData.get("file") ? (formData.get("file") as File).name : "text-input.txt";
    const fileType = fileName.toLowerCase().endsWith(".pdf") ? "pdf" : fileName.toLowerCase().endsWith(".docx") ? "docx" : "txt";

    const syllabus = await prisma.syllabus.create({
      data: {
        userId: user.id,
        fileName,
        fileType,
        rawText: text,
      },
    });

    // Filter out events with invalid dates before saving
    const validEvents = events.filter((event) => {
      const startDate = new Date(event.start);
      const isValidStart = !isNaN(startDate.getTime());

      if (!isValidStart) {
        console.warn(`Skipping event with invalid date: ${event.title} - ${event.start}`);
        return false;
      }

      // Also check end date if it exists
      if (event.end) {
        const endDate = new Date(event.end);
        if (isNaN(endDate.getTime())) {
          console.warn(`Event has invalid end date: ${event.title} - ${event.end}`);
          // Still include the event but we'll set end to null
        }
      }

      return true;
    });

    console.log(`Saving ${validEvents.length} valid events out of ${events.length} total`);

    // Save events to database
    const savedEvents = await prisma.event.createMany({
      data: validEvents.map((event) => {
        const eventType = categorizeEvent(event.title);
        console.log(`Event: "${event.title}" -> Type: ${eventType}`);
        return {
          syllabusId: syllabus.id,
          title: event.title,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : null,
          description: null,
          location: null,
          type: eventType,
        };
      }),
    });

    console.log(`Saved syllabus ${syllabus.id} with ${savedEvents.count} events`);

    // Record usage
    await recordUsage(user.id);
    console.log(`Usage recorded for user ${user.id}`);

    // Get updated usage stats
    const updatedUsageCheck = await canUserParseSyllabus(user.id, user.subscriptionTier);

    return NextResponse.json({
      events: validEvents,
      syllabusId: syllabus.id,
      usage: {
        current: updatedUsageCheck.currentUsage,
        limit: updatedUsageCheck.limit,
        tier: user.subscriptionTier,
      },
    });
  } catch (error) {
    console.error("Error parsing syllabus:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to parse syllabus" },
      { status: 500 }
    );
  }
}
