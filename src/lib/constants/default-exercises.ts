export interface DefaultExercise {
	name: string;
	steps: string[];
	icon?: string;
}

export const DEFAULT_EXERCISES: DefaultExercise[] = [
	{
		name: "Push-ups",
		icon: "accessibility",
		steps: [
			"3 sets of 8 incline push-ups (hands on bench/wall)",
			"3 sets of 10 incline push-ups",
			"3 sets of 8 knee push-ups",
			"3 sets of 10 knee push-ups",
			"3 sets of 8 full push-ups",
			"3 sets of 10 full push-ups",
		],
	},
	{
		name: "Bodyweight Squat",
		icon: "fitness_center",
		steps: [
			"3 sets of 10 box squats (squatting down to a chair)",
			"3 sets of 12 box squats",
			"3 sets of 10 full bodyweight squats",
			"3 sets of 12 full bodyweight squats",
			"3 sets of 15 full bodyweight squats",
		],
	},
	{
		name: "Pull-ups",
		icon: "trending_up",
		steps: [
			"3 sets of 5 negative pull-ups (slow lower down)",
			"3 sets of 8 negative pull-ups",
			"3 sets of 5 band-assisted pull-ups",
			"3 sets of 8 band-assisted pull-ups",
			"3 sets of 3 dead-stop full pull-ups",
			"3 sets of 5 dead-stop full pull-ups",
		],
	},
	{
		name: "Plank Hold",
		icon: "timer",
		steps: [
			"3 sets of 20 seconds forearm plank",
			"3 sets of 30 seconds forearm plank",
			"3 sets of 45 seconds forearm plank",
			"3 sets of 60 seconds forearm plank",
		],
	},
];
