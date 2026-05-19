import { quickExercises } from "$lib/stores/quickExercises";
import { get } from "svelte/store";
import type { Exercise, QuickExercise, TrainingSession } from "../types";
import { StorageKeys } from "./enums";
import { toYamlString } from "./parsing";

export function loadExercises(): Exercise[] | null {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(StorageKeys.EXERCISES_PROGRESS);
		if (!raw) return null;
		return JSON.parse(raw) as Exercise[];
	} catch {
		return null;
	}
}

export function saveExercises(
	exercises: Exercise[],
	persistToStorage: boolean = false,
): void {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(
			StorageKeys.EXERCISES_PROGRESS,
			JSON.stringify(exercises),
		);

		if (persistToStorage) {
			const updatedConfig = toYamlString({
				exercises,
				quick: get(quickExercises),
			});
			localStorage.setItem(StorageKeys.CONFIG_FILE, updatedConfig);
		}
	} catch (error) {
		console.error(error);
	}
}

export function clearExercisesProgress(): void {
	if (typeof localStorage === "undefined") return;
	localStorage.removeItem(StorageKeys.EXERCISES_PROGRESS);
}

export function loadSessions(): TrainingSession[] | null {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(StorageKeys.SESSIONS_LOG);
		if (!raw) return null;
		return JSON.parse(raw) as TrainingSession[];
	} catch {
		return null;
	}
}

export function saveSessions(sessions: TrainingSession[]): void {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(StorageKeys.SESSIONS_LOG, JSON.stringify(sessions));
	} catch {
		// ignore
	}
}

export function loadQuickExercises(): QuickExercise[] | null {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(StorageKeys.QUICK_EXERCISES);
		if (!raw) return null;
		return JSON.parse(raw) as QuickExercise[];
	} catch {
		return null;
	}
}

export function saveQuickExercises(quickExercises: QuickExercise[]): void {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(
			StorageKeys.QUICK_EXERCISES,
			JSON.stringify(quickExercises),
		);
	} catch {
		// ignore
	}
}
