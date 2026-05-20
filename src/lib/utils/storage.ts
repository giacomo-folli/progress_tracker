import type { Exercise } from "../types";
import { supabase } from "$lib/supabase";

/**
 * Loads all exercises along with their nested, ordered steps from Supabase.
 * Returns null if an error occurs or if no user session is active.
 */
export async function loadExercises(): Promise<Exercise[] | null> {
	try {
		const { data, error } = await supabase
			.from("exercises")
			.select(
				`id, name, icon, type, current_step_index, steps (id, description, completed, completed_at, step_index)`,
			)
			.order("step_index", { referencedTable: "steps" });

		if (error) {
			console.error("Supabase error while loading exercises:", error.message);
			return null;
		}

		if (!data) return null;
		return data as Exercise[];
	} catch (catchError) {
		console.error("Unexpected runtime failure loading exercises:", catchError);
		return null;
	}
}

/**
 * Updates the active step index for a specific exercise.
 * Useful when a user increments or decrements their current position.
 */
export async function updateExerciseProgress(
	exerciseId: string,
	next_step_index: number,
): Promise<boolean> {
	try {
		const { error } = await supabase
			.from("exercises")
			.update({ current_step_index: next_step_index })
			.eq("id", exerciseId);

		if (error) {
			console.error(
				`Failed to update progress for exercise ${exerciseId}:`,
				error.message,
			);
			return false;
		}
		return true;
	} catch (err) {
		console.error("Runtime error in updateExerciseProgress:", err);
		return false;
	}
}

/**
 * Saves a single step's completion status and its timestamp.
 * Call this immediately when a user checks/unchecks a specific step.
 */
export async function updateStepCompletion(
	stepId: string,
	completed: boolean,
	completedAt?: string | null,
): Promise<boolean> {
	try {
		const { error } = await supabase
			.from("steps")
			.update({
				completed,
				completed_at: completed
					? completedAt || new Date().toISOString()
					: null,
			})
			.eq("id", stepId);

		if (error) {
			console.error(`Failed to update step ${stepId}:`, error.message);
			return false;
		}
		return true;
	} catch (err) {
		console.error("Runtime error in updateStepCompletion:", err);
		return false;
	}
}
