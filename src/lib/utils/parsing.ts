import type { Exercise } from "../types";
import { parse } from "yaml";

export async function parseYamlString(
	string: string = "",
): Promise<Exercise[]> {
	try {
		const parsedData = parse(string) as {
			version: number;
			exercises: Record<string, { name: string; steps: string[] }>;
		};

		if (!parsedData || !parsedData.exercises) {
			throw new Error("Invalid YAML structure: 'exercises' object is missing.");
		}

		const exercisesArray: Exercise[] = Object.entries(parsedData.exercises).map(
			([key, data]) => {
				return {
					id: key,
					name: data.name,
					steps: makeSteps(data.steps),
					currentStepIndex: 0,
				} as Exercise;
			},
		);

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

export const exercisesFileTemplate = `version: 1

exercises:
  <exercise_id>:
    name: "<Exercise Name>"
    steps:
      - "<step 1 description>"
      - "<step 2 description>"
      - "<step 3 description>"

# Example structure:
# exercises:
#   push-ups:
#     name: "Push-Ups"
#     steps:
#       - "3 sets of 10 reps"
#       - "3 sets of 6 reps"
#       - "3 sets of 8 reps"
`;
