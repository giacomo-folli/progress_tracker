import { writable } from "svelte/store";
import type { QuickExercise } from "../types";
import { loadQuickExercises, saveQuickExercises } from "../utils/storage";

function createQuickExercisesStore() {
	const initial = loadQuickExercises() ?? [];
	const { subscribe, set } = writable<QuickExercise[]>(initial);

	return {
		subscribe,

		set(newQuickExercises?: QuickExercise[]) {
			const value = newQuickExercises || [];
			set(value);
			saveQuickExercises(value);
		},
	};
}

export const quickExercises = createQuickExercisesStore();
