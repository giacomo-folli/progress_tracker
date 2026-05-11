import { writable } from 'svelte/store';
import type { TrainingSession, SessionExercise } from '../types/exercise';
import { loadSessions, saveSessions } from '../utils/storage';

function createSessionsStore() {
	const initial = loadSessions() ?? [];
	const { subscribe, update } = writable<TrainingSession[]>(initial);

	return {
		subscribe,

		logSession(exercises: SessionExercise[]) {
			const session: TrainingSession = {
				id: crypto.randomUUID(),
				completedAt: new Date().toISOString(),
				exercises
			};
			update((sessions) => {
				const next = [session, ...sessions];
				saveSessions(next);
				return next;
			});
		},

		deleteSession(id: string) {
			update((sessions) => {
				const next = sessions.filter((s) => s.id !== id);
				saveSessions(next);
				return next;
			});
		}
	};
}

export const sessions = createSessionsStore();