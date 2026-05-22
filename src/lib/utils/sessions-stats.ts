import type { TrainingSession } from "../types";

export function getSessionDayKeys(sessions: TrainingSession[]): string[] {
	return [
		...new Set(
			sessions.map((s) =>
				new Date(s.completed_at).toISOString().slice(0, 10),
			),
		),
	].sort();
}

export function longestStreak(sessions: TrainingSession[]): number {
	const days = getSessionDayKeys(sessions);
	if (days.length === 0) return 0;
	let max = 1;
	let cur = 1;
	for (let i = 1; i < days.length; i++) {
		const diff =
			(new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) /
			86400000;
		if (diff === 1) {
			cur++;
			max = Math.max(max, cur);
		} else {
			cur = 1;
		}
	}
	return max;
}

export function currentStreak(sessions: TrainingSession[]): number {
	const days = getSessionDayKeys(sessions)
		.sort()
		.reverse();
	if (days.length === 0) return 0;
	const today = new Date().toISOString().slice(0, 10);
	const yesterday = new Date(Date.now() - 86400000)
		.toISOString()
		.slice(0, 10);
	if (days[0] !== today && days[0] !== yesterday) return 0;
	let streak = 1;
	for (let i = 1; i < days.length; i++) {
		const diff =
			(new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) /
			86400000;
		if (diff === 1) streak++;
		else break;
	}
	return streak;
}

export function weeksActive(sessions: TrainingSession[]): number {
	if (sessions.length === 0) return 1;
	const oldest = new Date(sessions[sessions.length - 1].completed_at);
	const diffMs = Date.now() - oldest.getTime();
	return Math.max(1, Math.ceil(diffMs / (7 * 86400000)));
}

export function avgSessionsPerWeek(sessions: TrainingSession[]): string {
	if (sessions.length === 0) return "0";
	return (sessions.length / weeksActive(sessions)).toFixed(1);
}

export function daysSinceLastSession(sessions: TrainingSession[]): number | null {
	if (sessions.length === 0) return null;
	return Math.floor(
		(Date.now() - new Date(sessions[0].completed_at).getTime()) / 86400000,
	);
}

export function formatLastSessionRelative(sessions: TrainingSession[]): string {
	if (sessions.length === 0) return "Nessuna ancora";
	const days = daysSinceLastSession(sessions);
	if (days === 0) return "Oggi";
	if (days === 1) return "Ieri";
	return `${days} gg fa`;
}
