<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Prossima, a SvelteKit fitness tracking PWA. Here is a summary of all changes made:

- **`posthog-js` installed** as a runtime dependency (v1.376.0 via pnpm).
- **`src/hooks.client.ts` created** — initializes PostHog on app start using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables. Also captures client-side errors via `handleError`.
- **`svelte.config.js` updated** — added `paths.relative: false` required for PostHog session replay to work correctly with SvelteKit SSR.
- **`.env.local` created** — contains `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` (gitignored).
- **`src/routes/auth/+page.svelte` updated** — `posthog.identify()` + `user_logged_in` on successful login; `posthog.identify()` + `user_signed_up` on successful signup.
- **`src/routes/training/+page.svelte` updated** — `session_logged` event with exercise counts when a training session is logged.
- **`src/routes/training/[id]/+page.svelte` updated** — `session_edited` on session save; `session_deleted` before deletion.
- **`src/routes/exercises/[id]/+page.svelte` updated** — `exercise_step_completed` and `exercise_step_undone` with step index and progress properties.
- **`src/routes/settings/+page.svelte` updated** — `user_logged_out` + `posthog.reset()` on sign-out; `exercise_progress_reset` and `training_history_cleared` on destructive actions.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `src/routes/auth/+page.svelte` |
| `user_logged_in` | User signs in with email and password | `src/routes/auth/+page.svelte` |
| `session_logged` | User logs a completed training session — primary conversion event | `src/routes/training/+page.svelte` |
| `session_edited` | User saves edits to an existing training session | `src/routes/training/[id]/+page.svelte` |
| `session_deleted` | User permanently deletes a training session | `src/routes/training/[id]/+page.svelte` |
| `exercise_step_completed` | User marks the current step of an exercise as complete | `src/routes/exercises/[id]/+page.svelte` |
| `exercise_step_undone` | User undoes the last completed step of an exercise | `src/routes/exercises/[id]/+page.svelte` |
| `user_logged_out` | User explicitly signs out of the app | `src/routes/settings/+page.svelte` |
| `exercise_progress_reset` | User resets all exercise progress (danger zone) | `src/routes/settings/+page.svelte` |
| `training_history_cleared` | User permanently clears their entire training history (danger zone) | `src/routes/settings/+page.svelte` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1626223) — all insights in one place
- [Training sessions logged over time](/insights/7jcizkF0) — daily count of sessions logged (primary conversion metric)
- [New user signups over time](/insights/QFKGwcLV) — daily unique users who signed up (top of funnel)
- [Signup to first session funnel](/insights/H61O0aGM) — conversion from signup to first training session logged (activation)
- [Exercise step completions over time](/insights/r6EK1e1z) — daily step completions showing active program engagement
- [Churn signals: logouts and history clears](/insights/PFRpxjLx) — users logging out or clearing history (disengagement indicators)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-sveltekit/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
