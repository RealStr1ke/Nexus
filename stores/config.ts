import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Theme } from '@/types/theme';
import { validateTheme, defaultLightTheme, defaultDarkTheme } from '@/types/theme';
import type { Settings } from '@/types/settings';
import { defaultSettings, validateSettings } from '@/types/settings';

const STORAGE_KEY = 'nexus-settings';

export const useConfigStore = defineStore('config', () => {
	const settings = ref<Settings>(defaultSettings);

	const currentTheme = ref<Theme | null>(null);
	const availableThemes = ref<Record<string, Theme>>({});

	async function loadAllThemes(): Promise<Record<string, Theme>> {
		try {
			const response = await fetch('/assets/themes.json');
			const data = await response.json();
			return data.themes;
		} catch (error) {
			console.error('Failed to load themes', error);
			return {};
		}
	}

	async function reloadThemes() {
		availableThemes.value = await loadAllThemes();
	}

	async function setTheme(theme: 'light' | 'dark' | 'system' | 'preset' | 'custom', presetTheme?: string, customTheme?: Theme) {
		if (theme === 'light') {
			currentTheme.value = defaultLightTheme;
		} else if (theme === 'dark') {
			currentTheme.value = defaultDarkTheme;
		} else if (theme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			currentTheme.value = prefersDark ? defaultDarkTheme : defaultLightTheme;
		} else if (theme === 'preset' && presetTheme) {
			const themes = await loadAllThemes();
			const preset = themes[presetTheme] || null;
			if (preset) {
				currentTheme.value = preset;
				settings.value.theme.presetTheme = presetTheme;
			}
		} else if (theme === 'custom' && customTheme && validateTheme(customTheme)) {
			currentTheme.value = customTheme;
			settings.value.theme.customTheme = customTheme;
		} else {
			const themes = await loadAllThemes();
			const selectedTheme = themes[theme] || null;
			if (selectedTheme) {
				currentTheme.value = selectedTheme;
			}
		}

		settings.value.theme.theme = theme;
		saveSettings();
	}

	function getTheme(theme: 'light' | 'dark' | 'system' | 'preset' | 'custom', presetTheme?: string, customTheme?: Theme): Theme | null {
		if (theme === 'light') {
			return defaultLightTheme;
		} else if (theme === 'dark') {
			return defaultDarkTheme;
		} else if (theme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			return prefersDark ? defaultDarkTheme : defaultLightTheme;
		} else if (theme === 'preset' && presetTheme) {
			const themes = availableThemes.value;
			return themes[presetTheme] || null;
		} else if (theme === 'custom' && customTheme && validateTheme(customTheme)) {
			return customTheme;
		} else {
			const themes = availableThemes.value;
			return themes[theme] || null;
		}
	}

	function getCurrentTheme(): Theme | null {
		const themeName = settings.value.theme.theme;
		return getTheme(themeName, settings.value.theme.presetTheme, settings.value.theme.customTheme);
	}

	function loadSettings() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsedSettings = JSON.parse(stored);

				if (validateSettings(parsedSettings)) {
					// Merge with defaults to ensure all fields exist
					settings.value = {
						...defaultSettings,
						...parsedSettings,
					};
				} else {
					console.error('Invalid settings format, using defaults');
					settings.value = defaultSettings;
				}
			} else {
				settings.value = defaultSettings;
			}
		} catch (error) {
			console.error('Failed to parse stored settings, using defaults:', error);
			settings.value = defaultSettings;
		}

		// Set the current theme based on the loaded settings
		const themeName = settings.value.theme.theme;
		if (themeName === 'light') {
			currentTheme.value = defaultLightTheme;
		} else if (themeName === 'dark') {
			currentTheme.value = defaultDarkTheme;
		} else {
			setTheme(themeName, settings.value.theme.presetTheme, settings.value.theme.customTheme);
		}
	}

	function saveSettings() {
		if (validateSettings(settings.value)) {
			console.log('Saving settings...');
			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored) {
					const oldSettings = JSON.parse(stored);
					const flattenObject = (obj: any, prefix = '') => {
						return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
							const value = obj[key];
							const newKey = prefix ? `${prefix}.${key}` : key;
							if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
								Object.assign(acc, flattenObject(value, newKey));
							} else {
								acc[newKey] = value;
							}
							return acc;
						}, {});
					};
					const oldFlat = flattenObject(oldSettings);
					const newFlat = flattenObject(settings.value);
					Object.keys(newFlat).forEach(key => {
						if (oldFlat[key] !== newFlat[key] && typeof newFlat[key] !== 'object') {
							console.log(`Config change: ${key} = ${oldFlat[key]} → ${newFlat[key]}`);
						}
					});
				}
			} catch (error) {
				console.error('Failed to compare settings:', error);
			}
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
			console.log('Settings saved');
		} else {
			console.error('Invalid settings, not saving');
		}
	}

	watch(
		settings,
		(_newSettings) => {
			saveSettings();
		},
		{ deep: true },
	);

	loadSettings();
	reloadThemes();

	return {
		settings,
		currentTheme,
		availableThemes,
		setTheme,
		getCurrentTheme,
		validateTheme,
		loadSettings,
		saveSettings,
		reloadThemes,
	};
});
