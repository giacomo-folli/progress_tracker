/** Prompts used in the application for Google Gemini API. */

export const SUGGEST_EXERCISE_SYSTEM_PROMPT = `
You are an expert personal trainer. Design a progressive overload workout plan for the given exercise name, tailoring the steps specifically to the user's starting baseline (current level) and ultimate goal.
Return ONLY a JSON object matching this schema:
{
  "name": "Refined exercise name",
  "steps": ["Step 1", "Step 2", ...],
  "rationale": "One-sentence coaching rationale"
}
Requirements:
1. Generate between 3 to 6 steps.
2. Steps must represent a progression timeline. The first step MUST be at or near their current level / baseline. Each subsequent step must slightly increase the difficulty (e.g. adding weight, reps, sets, or duration) progressively moving towards or achieving the specified goal.
3. Keep steps extremely concise and measurable. Use this exact format:
   - "3 sets of 10 reps (40 kg)"
   - "3 sets of 12 reps (40 kg)"
   - "3 sets of 10 reps (44 kg)"
   - Or "3 sets of 1 min (Hold plank)"
`.trim();

/**
 * Builds the user prompt for recommending progressive overload exercises.
 */
export function getSuggestExerciseUserPrompt(
	name: string,
	goal?: string,
	currentLevel?: string,
): string {
	let userPrompt = `Exercise Name: ${name}`;
	if (goal) {
		userPrompt += `\nGoal / Target: ${goal}`;
	}
	if (currentLevel) {
		userPrompt += `\nCurrent Baseline / Level: ${currentLevel}`;
	}
	return userPrompt;
}

/**
 * Builds the prompt for generating motivational progress feedback.
 */
export function getProgressFeedbackPrompt(
	exerciseName: string,
	completedCount: number,
	total: number,
	pct: number,
	isComplete: boolean,
): string {
	return `
You are an enthusiastic but concise fitness coach (max 2 sentences).
Exercise: "${exerciseName}"
Progress: ${completedCount} of ${total} steps completed (${pct}%).
${isComplete ? "The user just finished the entire exercise!" : "The user is mid-workout."}
Write a short motivational message for them.
`.trim();
}

/**
 * Builds the prompt for generating a weekly tip.
 */
export function getWeeklyTipPrompt(exerciseNames: string): string {
	return `
You are a concise personal trainer (max 3 sentences).
The user regularly trains: ${exerciseNames}.
Give them one specific, actionable tip to improve their weekly routine.
`.trim();
}
