import type { Exercise } from "../types";
import { parse } from "yaml";

export async function parseYamlString(
	string: string = "",
): Promise<Exercise[]> {
	try {
		const parsedData = parse(string) as {
			version: number;
			exercises: Record<
				string,
				{ name: string; steps: { description: string; active?: boolean }[] }
			>;
		};

		if (!parsedData || !parsedData.exercises) {
			throw new Error("Invalid YAML structure: 'exercises' object is missing.");
		}

		const parsedExercises = Object.entries(parsedData.exercises);
		const exercisesArray: Exercise[] = parsedExercises.map(([key, data]) => {
			return {
				id: key,
				name: data.name,
				steps: makeStepsImproved(data.steps),
				currentStepIndex: data.steps.findIndex((s) => s.active),
			} as Exercise;
		});

		return exercisesArray;
	} catch (error) {
		console.error("Error parsing yaml string plan:", error);
		throw error;
	}
}

export function makeSteps(labels: string[]) {
	return labels.map((label, i) => ({
		id: `step-${i}`,
		label,
		completed: false,
		completedAt: undefined,
	}));
}

export function makeStepsImproved(
	steps: { description: string; active?: boolean }[],
) {
	return steps.map((item, i) => ({
		id: `step-${i}`,
		label: item.description,
		completed: false,
		completedAt: undefined,
	}));
}

export const defaultExercises = `version: 1

exercises:
  <exercise_id>:
    name: "<Exercise Name>"
    steps:
      - description: "<step 1 description>"
	    active: true
      - description: "<step 2 description>"
      - description: "<step 3 description>"

# Example structure:
# exercises:
#   push-ups:
#     name: "Push-Ups"
#     steps:
#       - description: "3 sets of 10 reps"
#       - description: "3 sets of 6 reps"
#       - description: "3 sets of 8 reps"
#         active: true
`;
