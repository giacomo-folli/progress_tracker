import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			strict: false
		}),
		paths: {
			base: dev ? '' : '/progress_tracker'
		},
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
