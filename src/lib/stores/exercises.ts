import { writable, derived } from "svelte/store";
import type { Exercise } from "../types";
import { loadExercises, saveExercises } from "../utils/storage";

function createExercisesStore() {
	const initial = loadExercises() ?? [];
	const { subscribe, set, update } = writable<Exercise[]>(initial);

	return {
		subscribe,

		completeCurrentStep(exerciseId: string) {
			update((exercises) => {
				const exercise = exercises.find((e) => e.id === exerciseId);
				if (!exercise) return exercises;

				const step = exercise.steps[exercise.currentStepIndex];
				if (!step || step.completed) return exercises;

				step.completed = true;
				step.completedAt = new Date().toISOString();

				const nextIndex = exercise.currentStepIndex + 1;
				if (nextIndex < exercise.steps.length) {
					exercise.currentStepIndex = nextIndex;
				}

				saveExercises(exercises);
				return exercises;
			});
		},

		undoLastCompletion(exerciseId: string) {
			update((exercises) => {
				const ex = exercises.find((e) => e.id === exerciseId);
				if (!ex) return exercises;

				// Find last completed step
				let lastCompletedIndex = -1;
				for (let i = ex.steps.length - 1; i >= 0; i--) {
					if (ex.steps[i].completed) {
						lastCompletedIndex = i;
						break;
					}
				}

				if (lastCompletedIndex === -1) return exercises;

				ex.steps[lastCompletedIndex].completed = false;
				ex.steps[lastCompletedIndex].completedAt = undefined;
				ex.currentStepIndex = lastCompletedIndex;

				saveExercises(exercises);
				return exercises;
			});
		},

		reset(newExercises?: Exercise[]) {
			const exercises = newExercises || [];
			set(
				exercises.map((ex) => ({
					...ex,
					steps: ex.steps.map((s) => ({
						...s,
						completed: false,
						completedAt: undefined,
					})),
					currentStepIndex: 0,
				})),
			);

			saveExercises(exercises);
		},

		clearProgress() {
			update((exercises) => {
				const newExercise = exercises.map((ex) => ({
					...ex,
					steps: ex.steps.map((s) => ({
						...s,
						completed: false,
						completedAt: undefined,
					})),
					currentStepIndex: 0,
				}));

				saveExercises(newExercise);
				return newExercise;
			});
		},
	};
}

export const exercises = createExercisesStore();

export const exerciseProgress = derived(exercises, ($exercises) =>
	$exercises.map((ex) => {
		const completedCount = ex.steps.filter((s) => s.completed).length;
		const total = ex.steps.length;
		const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
		const current = ex.steps[ex.currentStepIndex] ?? null;
		const next = ex.steps[ex.currentStepIndex + 1] ?? null;
		const isComplete = completedCount === total;

		return {
			id: ex.id,
			name: ex.name,
			completedCount,
			total,
			pct,
			current,
			next,
			isComplete,
		};
	}),
);
