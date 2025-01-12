import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Theme } from '@/types/theme';
import { validateTheme, defaultLightTheme, defaultDarkTheme } from '@/types/theme';
import type { Settings } from '@/types/settings';
import { defaultSettings, validateSettings } from '@/types/settings';
import type { BackgroundImage } from '@/types/images';
import { validateBackgroundImage } from '@/types/images';

const STORAGE_KEY = 'nexus-settings';

export const useConfigStore = defineStore('config', () => {
	const settings = ref<Settings>(defaultSettings);

	const currentTheme = ref<Theme | null>(null);
	const availableThemes = ref<Record<string, Theme>>({});
	const devBackgroundImages = ref<Record<string, BackgroundImage>>({});
	const devBackgroundImagesLoaded = ref(false);

	async function loadAllThemes(): Promise<Record<string, Theme>> {
		try {
			const response = await fetch('/themes/themes.json');
			const data = await response.json();
			return data.themes;
		} catch (error) {
			console.error('Failed to load themes', error);
			return {};
		}
	}

	async function loadDevBackgroundImages() {
		try {
			const response = await fetch('/backgrounds/backgrounds.json');
			const data = await response.json();
			devBackgroundImages.value = data.images;
			devBackgroundImagesLoaded.value = true;
		} catch (error) {
			console.error('Failed to load background images', error);
		}
	}

	function getCurrentBackgroundImage(): BackgroundImage | null {
		if (!devBackgroundImagesLoaded.value) {
			return null;
		}
		const selectedImageId = settings.value.background.selectedImage;
		console.log(`Image ID: ${selectedImageId}`);
		if (settings.value.background.type === 'image' && selectedImageId) {
			const selectedImage = devBackgroundImages.value[selectedImageId];
			console.log('Selected image:', JSON.parse(JSON.stringify(selectedImage)));
			return selectedImage || null;
		} else if (settings.value.background.type === 'custom') {
			console.log('Custom image:', JSON.parse(JSON.stringify(settings.value.background.customImage)));
			return settings.value.background.customImage || null;
		}
		return null;
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

	function saveSettings() {
		if (typeof window !== 'undefined' && validateSettings(settings.value)) {
			console.log('Saving settings...');
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
			console.log('Settings saved');
		} else {
			console.error('Invalid settings, not saving');
		}
	}

	function resetSettings() {
		settings.value = defaultSettings;
		saveSettings();
		console.log('Settings reset to defaults');
	}

	function loadSettings() {
		console.log('Loading settings...');
		if (typeof window !== 'undefined') {
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
				console.log('Retrieved settings from local storage');
			} catch (error) {
				console.error('Failed to parse stored settings, using defaults:', error);
				settings.value = defaultSettings;
			}
		} else {
			console.error('Window object not available, using defaults');
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

		// Set the default background image if none is selected
		if (settings.value.background.type === 'image' && !settings.value.background.selectedImage) {
			const defaultImage = Object.values(devBackgroundImages.value)[0];
			if (defaultImage?.id) {
				settings.value.background.selectedImage = defaultImage.id;
			}
		}
		console.log('Settings loaded');
		// resetSettings(); // for development
	}

	function setCurrentImage(imageUrl: string) {
		if (settings.value.background.type === 'image') {
			const selectedImage = Object.values(devBackgroundImages.value).find(image => image.src === imageUrl);
			if (selectedImage && selectedImage.id) {
				settings.value.background.selectedImage = selectedImage.id;
				saveSettings();
			}
		}
	}

	function setCustomImage(image: BackgroundImage) {
		if (settings.value.background.type === 'custom' && validateBackgroundImage(image)) {
			settings.value.background.customImage = image;
			saveSettings();
		}
	}

	watch(
		settings,
		(_newSettings) => {
			saveSettings();
		},
		{ deep: true },
	);

	async function init() {
		await loadDevBackgroundImages();
		await loadSettings();
		await reloadThemes();
	}

	init();

	return {
		settings,
		currentTheme,
		availableThemes,
		devBackgroundImages,
		devBackgroundImagesLoaded,
		getCurrentBackgroundImage,
		loadDevBackgroundImages,
		setTheme,
		getCurrentTheme,
		validateTheme,
		loadSettings,
		saveSettings,
		resetSettings,
		reloadThemes,
		setCurrentImage,
		setCustomImage,
	};
});
