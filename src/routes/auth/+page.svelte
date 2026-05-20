<!-- src/routes/auth/+page.svelte -->
<script lang="ts">
	import { supabase } from "$lib/supabase";

	let email = "";
	let password = "";
	let errorMessage = "";

	async function handleSignUp() {
		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) errorMessage = error.message;
	}

	async function handleLogIn() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) errorMessage = error.message;
		else alert("Logged in successfully!");
	}
</script>

<main class="auth-form">
	<h2>Access Your Training Sandbox</h2>

	<input type="email" placeholder="Your Email" bind:value={email} />
	<input type="password" placeholder="Password" bind:value={password} />

	<button on:click={handleLogIn}>Log In</button>
	<button on:click={handleSignUp}>Sign Up</button>

	{#if errorMessage}<p class="error">{errorMessage}</p>{/if}
</main>
