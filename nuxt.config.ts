import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	css: [
		'~/assets/styles/main.css',
	],
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
});