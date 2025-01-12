/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
	mode: 'jit',
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./app.vue',
		'./error.vue',
	],
	plugins: [
		daisyui,
	],

	daisyui: {
		themes: [
			'night',
		],
	},
};