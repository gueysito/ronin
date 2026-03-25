import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		setupFiles: [],
		alias: {
			$lib: new URL('./src/lib', import.meta.url).pathname,
			'$lib/*': new URL('./src/lib/*', import.meta.url).pathname
		}
	}
});
