/** Represents an individual step in a training exercise. */
export interface Step {
	id: string;
	description: string;
	completed: boolean;
	completed_at?: string;
	step_index: number;
}

/** Represents an exercise in a training program, including
 *  its ordered steps and current progress. */
export interface Exercise {
	id: string;
	name: string;
	icon?: string;
	steps?: Step[];
	current_step_index?: number;
	type: "exercise" | "quick-exercise";
}

/** Represents a completed training session with metadata and the
 * exercises included in that session. */
export interface TrainingSession {
	id?: string;
	completed_at: string;
	exercises: Exercise[];
}
