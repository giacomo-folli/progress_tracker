import { writable } from "svelte/store";
import type { Exercise, TrainingSession } from "../types";
// import { loadSessions, saveSessions } from "../utils/storage";

function createSessionsStore() {
	// const initial = loadSessions() ?? [];
	const { subscribe, update, set } = writable<TrainingSession[]>([]);

	return {
		subscribe,

		async logSession(exercises: Exercise[]) {
			let next: TrainingSession[] = [];

			const session: TrainingSession = {
				completed_at: new Date().toISOString(),
				exercises,
			};
			update((sessions) => {
				next = [session, ...sessions];
				return next;
			});

			// saveSessions(next);
		},

		deleteSession(id: string) {
			let next: TrainingSession[] = [];
			update((sessions) => {
				next = sessions.filter((s) => s.id !== id);
				return next;
			});

			// saveSessions(next);
		},

		clearSessions() {
			set([]);
			// saveSessions([]);
		},
	};
}

export const sessions = createSessionsStore();
