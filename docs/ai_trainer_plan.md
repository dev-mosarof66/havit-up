# AI Habit Trainer & Feedback System Architecture

This document outlines the strategy for integrating an AI engine into **Habit Up**. The AI will serve two primary roles: an analytical engine for **Feedback**, and a proactive, motivational **Trainer**.

## 1. Feature Breakdown

### A. AI Feedback Engine (Analytical)
The feedback engine analyzes the user's historical habit data to provide actionable insights.
- **Weekly/Monthly Reviews**: Automatically generates a "Week in Review" summary highlighting consistencies and drops.
- **Pattern Recognition**: Identifies hidden patterns. For example: *"You frequently miss your 'Reading' habit on days when you skip your 'Morning Run'."*
- **Data-Driven Adjustments**: Detects if a goal is too ambitious (e.g., 0% completion rate over 2 weeks) and suggests scaling it down.

### B. AI Habit Trainer (Proactive)
The trainer acts as a personal coach, actively engaging the user to improve retention.
- **Motivational Nudges**: Generates custom, context-aware motivational messages when a streak is at risk of breaking.
- **Habit Generation**: Users provide a high-level goal (*"I want to sleep better"*), and the AI generates a customized, structured habit plan (e.g., *"No screens after 9 PM"*, *"Read 10 pages"*, *"Meditate 5 mins"*).
- **Dynamic Adaptability**: Acts like a conversational coach. Users can ask, *"I'm feeling burnt out this week, what should I do?"* and the AI temporarily adjusts their targets.

## 2. Technical Architecture

### Model & Integration
- **LLM Provider**: OpenAI API (gpt-4o-mini for cost efficiency) or Google Gemini API.
- **Framework**: Vercel AI SDK or direct REST API calls within Next.js Server Actions.

### Data Flow (Contextual Prompting)
When calling the AI, we will pass a structured JSON payload representing the user's state:
```json
{
  "activeHabits": ["Morning Run", "Reading"],
  "recentLogs": [...],
  "currentStreaks": {"Morning Run": 12, "Reading": 0},
  "userGoal": "Build consistency"
}
```
The AI will use this context to generate personalized JSON responses that our UI will render as cards or chat messages.

## 3. Database Schema Updates

We need a way to store AI-generated insights so we don't query the LLM on every page load. We can add a new TypeORM Entity:

```typescript
// entities/AiInsight.ts
@Entity()
export class AiInsight {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string; // Relation to User

  @Column("text")
  type: "feedback" | "trainer_nudge" | "weekly_summary";

  @Column("text")
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

## 4. UI/UX Implementation Strategy

> [!TIP]
> Keep the AI unobtrusive. It should feel like a helpful assistant, not a strict boss.

1. **The "Insights" Panel**: Add a new tab to the Sidebar called **AI Coach**. This page will feature a chat-like interface or a feed of recent insights.
2. **Dashboard Cards**: Inject small, dismissible "Trainer Notes" into the main dashboard (e.g., *"🔥 You're on a 12-day run streak. Don't stop now!"*).
3. **Smart Modals**: When a user clicks "Add Habit", provide an option: **✨ Generate with AI**.

## 5. Implementation Phases

- **Phase 1: Manual Summaries**: Implement a "Generate Insights" button on the dashboard that sends the last 7 days of data to the LLM and displays a markdown response.
- **Phase 2: Database Persistence**: Save these insights to the database so they persist across sessions.
- **Phase 3: Proactive Trainer**: Implement a cron job (using Vercel Cron) that runs nightly, evaluates users at risk of breaking streaks, and generates nudges for them the next morning.

## Open Questions for You

> [!WARNING]
> Before we start building, we need to decide on a few key directions:

1. **Chat vs. Feed**: Do you want the AI Trainer to be an interactive Chatbot, or should it just passively generate a feed of advice cards?
2. **API Choice**: Do you have a preference between OpenAI or Gemini for the backend processing?
3. **First Feature**: Which feature do you want to tackle first? The Weekly Feedback summary or the "Generate Habit with AI" feature?
